"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const User_1 = require("../models/User");
const utils_1 = require("../../utils/utils");
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserService = {
    createUser(userData, accountData, redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeNow = Math.floor(Date.now() / 1000);
            const userID = uuid_1.v4();
            // users
            userData.id = userID;
            userData.createdAt = timeNow;
            // accounts
            const encryptedPassword = yield utils_1.hashPassword(accountData.password);
            accountData.userID = userID;
            accountData.password = encryptedPassword;
            accountData.createdAt = timeNow;
            // transactional
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                // Save to collection 1
                yield User_1.UserCollection.create([userData], opts);
                // Save to collection 2
                yield User_1.AuthCollection.create([accountData], opts);
                yield session.commitTransaction();
                session.endSession();
                // if saving success, delete current caching data
                yield redisClient.hdel("repo:users", "all");
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                throw error;
            }
            return userData;
        });
    },
    updateUser(idParam, userData, redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userData.updatedAt = Math.floor(Date.now() / 1000);
                const res = yield User_1.UserCollection.findOneAndUpdate({ id: idParam }, { $set: userData }, { new: true });
                // if update successful, delete current caching
                if (res) {
                    yield redisClient.hdel("repo:users", "all");
                    // dont need to find the previous acc and identity number since it is unique
                    yield redisClient.hdel("repo:users_account", res.accountNumber.toString());
                    yield redisClient.hdel("repo:users_identity", res.identityNumber.toString());
                }
                return res;
            }
            catch (error) {
                throw new Error(`Update User has an error: ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    },
    deleteUser(idParam, redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                // delete user
                const resUser = yield User_1.UserCollection.findOneAndDelete({ id: idParam }, opts);
                // delete account
                yield User_1.AuthCollection.findOneAndDelete({ userID: idParam }, opts);
                yield session.commitTransaction();
                session.endSession();
                // if delete successful, delete current caching
                if (resUser) {
                    yield redisClient.hdel("repo:users", "all");
                    // dont need to find the previous acc and identity number since it is unique
                    yield redisClient.hdel("repo:users_account", resUser.accountNumber.toString());
                    yield redisClient.hdel("repo:users_identity", resUser.identityNumber.toString());
                }
                return resUser;
            }
            catch (error) {
                throw new Error(`Delete User has an error ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    },
    getAllUser(redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find from redis first
                const dataRedis = yield redisClient.hget("repo:users", "all");
                if (dataRedis) {
                    const result = JSON.parse(dataRedis);
                    return result;
                }
                const allUsers = yield User_1.UserCollection.find();
                if (allUsers.length > 0) {
                    // save to redis
                    yield redisClient.hset("repo:users", "all", JSON.stringify(allUsers));
                }
                return allUsers;
            }
            catch (error) {
                throw new Error(`Get All User has an error: ${error === null || error === void 0 ? void 0 : error.messsage}`);
            }
        });
    },
    getUserByAccountNumber(accNumber, redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find from redis first
                const dataRedis = yield redisClient.hget("repo:users_account", accNumber);
                if (dataRedis) {
                    const result = JSON.parse(dataRedis);
                    return result;
                }
                const userData = yield User_1.UserCollection.findOne({ accountNumber: parseInt(accNumber) });
                if (userData) {
                    // save to redis
                    yield redisClient.hset("repo:users_account", accNumber, JSON.stringify(userData));
                }
                return userData;
            }
            catch (error) {
                throw new Error(`Get User By Account Number has an error: ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    },
    getUserByIdentityNumber(idNumber, redisClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find from redis first
                const dataRedis = yield redisClient.hget("repo:users_identity", idNumber);
                if (dataRedis) {
                    const result = JSON.parse(dataRedis);
                    return result;
                }
                const userData = yield User_1.UserCollection.findOne({ identityNumber: parseInt(idNumber) });
                if (userData) {
                    yield redisClient.hset("repo:users_identity", idNumber, JSON.stringify(userData));
                }
                return userData;
            }
            catch (error) {
                throw new Error(`Get User By Identity Number has an error: ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    },
    findAccountForLogin(userNameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountData = yield User_1.AuthCollection.findOne({
                    $or: [{ userName: userNameOrEmail }, { emailAddress: userNameOrEmail }]
                });
                if (!accountData) {
                    return null;
                }
                const passwordMatch = yield utils_1.comparePassword(password, accountData.password);
                if (!passwordMatch) {
                    return null;
                }
                return accountData;
            }
            catch (error) {
                throw new Error(`Find Account for Login has an error ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    }
};
