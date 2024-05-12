"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    userName: { type: String, unique: true, required: true },
    accountNumber: { type: Number, unique: true, required: true },
    emailAddress: { type: String, unique: true, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    identityNumber: { type: Number, unique: true, required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    deletedAt: { type: Number },
}, {
    collection: 'users'
});
userSchema.index({ userName: 1 });
userSchema.index({ emailAddress: 1 });
userSchema.index({ accountNumber: 1 });
userSchema.index({ identityNumber: 1 });
const UserCollection = mongoose_1.default.model('User', userSchema);
exports.UserCollection = UserCollection;
const authSchema = new mongoose_1.default.Schema({
    userID: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    createdAt: { type: Number }
}, {
    collection: 'accounts'
});
authSchema.index({ userName: 1 });
authSchema.index({ emailAddress: 1 });
const AuthCollection = mongoose_1.default.model('Auth', authSchema);
exports.AuthCollection = AuthCollection;
