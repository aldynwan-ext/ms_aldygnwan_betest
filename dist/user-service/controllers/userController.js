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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const utils_1 = require("../../utils/utils");
exports.UserController = (userService, redisClient) => ({
    createUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null,
        };
        const userParam = new User_1.UserCollection(req.body);
        const accountParam = new User_1.AuthCollection(req.body);
        try {
            // create user and account
            const user = yield userService.createUser(userParam, accountParam, redisClient);
            resp.success = true;
            resp.message = "success";
            resp.data = user;
            res.status(201).json(resp);
            return;
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null
        };
        try {
            const user = yield userService.updateUser(req.params.id, req.body, redisClient);
            if (!user) {
                resp.message = "User not Found!";
                res.status(201).json(resp);
                return;
            }
            resp.success = true;
            resp.message = "success";
            resp.data = user;
            res.status(201).json(resp);
            return;
        }
        catch (error) {
            const resp = {
                success: false,
                message: error === null || error === void 0 ? void 0 : error.message,
                data: null,
            };
            res.status(500).json(resp);
        }
    }),
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null
        };
        try {
            // delete user and account
            const reqParam = req.params.id;
            if (!reqParam) {
                resp.message = "User ID is Required!";
                res.status(400).json(resp);
                return;
            }
            const userID = reqParam;
            const userData = yield userService.deleteUser(userID, redisClient);
            if (!userData) {
                resp.message = "No User Found!";
                res.status(201).json(resp);
                return;
            }
            resp.success = true;
            resp.message = "success";
            resp.data = userData;
            res.status(201).json(resp);
            return;
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    }),
    getAllUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null,
        };
        try {
            const allUser = yield userService.getAllUser(redisClient);
            if ((allUser === null || allUser === void 0 ? void 0 : allUser.length) == 0) {
                resp.message = "There are No User Registered!";
                res.status(201).json(resp);
                return;
            }
            resp.success = true;
            resp.message = "success";
            resp.data = allUser;
            res.status(201).json(resp);
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    }),
    getUserByAccountNumber: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null,
        };
        try {
            const reqParam = req.query.accountNumber;
            if (!reqParam) {
                resp.message = "Account Number is Required!";
                res.status(400).json(resp);
                return;
            }
            const accountNumber = reqParam;
            const userData = yield userService.getUserByAccountNumber(accountNumber, redisClient);
            if (!userData) {
                resp.message = "No User Found!";
                res.status(201).json(resp);
                return;
            }
            resp.success = true;
            resp.message = "success";
            resp.data = userData;
            res.status(201).json(resp);
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    }),
    getUserByIdentityNumber: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let resp = {
            success: false,
            message: "",
            data: null
        };
        try {
            const reqParam = req.query.identityNumber;
            if (!reqParam) {
                resp.message = "Identity Number is Required!";
                res.status(400).json(resp);
                return;
            }
            const identityNumber = reqParam;
            const userData = yield userService.getUserByIdentityNumber(identityNumber, redisClient);
            if (!userData) {
                resp.message = "No User Found!";
                res.status(201).json(resp);
                return;
            }
            resp.success = true;
            resp.message = "success";
            resp.data = userData;
            res.status(201).json(resp);
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // if login success, get token
        let resp = {
            success: false,
            message: "",
            token: ""
        };
        const { userOrEmail, password } = req.body;
        if (!userOrEmail) {
            resp.message = "Email or Username is Required";
            res.status(400).json(resp);
            return;
        }
        if (!password) {
            resp.message = "Password is Required!";
            res.status(400).json(resp);
            return;
        }
        try {
            // find data in account collection
            const account = yield userService.findAccountForLogin(userOrEmail, password);
            if (!account) {
                resp.message = "Account not found! Please check your Email/Username and Password.";
                res.status(400).json(resp);
                return;
            }
            // if account is found, then generate token
            const token = utils_1.generateToken({ userID: account.userID, userName: account.userName });
            resp.success = true;
            resp.message = "success";
            resp.token = token;
            res.status(201).json(resp);
            return;
        }
        catch (error) {
            resp.message = error === null || error === void 0 ? void 0 : error.message;
            res.status(500).json(resp);
        }
    })
});
