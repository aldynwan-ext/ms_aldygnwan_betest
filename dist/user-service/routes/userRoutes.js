"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const utils_1 = require("../../utils/utils");
const redis_1 = require("../../utils/redis");
const userService_1 = require("../services/userService");
const router = express_1.Router();
const redisClient = redis_1.createRedisClient();
const userService = userService_1.UserService;
const userController = userController_1.UserController(userService, redisClient);
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', utils_1.authMiddleware, userController.deleteUser);
router.get('/get/all', utils_1.authMiddleware, userController.getAllUser);
router.get('/get/accountNumber', utils_1.authMiddleware, userController.getUserByAccountNumber);
router.get('/get/identityNumber', utils_1.authMiddleware, userController.getUserByIdentityNumber);
exports.default = router;
