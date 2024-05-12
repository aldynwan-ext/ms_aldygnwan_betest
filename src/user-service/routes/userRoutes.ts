import { Router } from 'express';
import { UserController}from '../controllers/userController';
import { authMiddleware } from '../../utils/utils';
import { createRedisClient } from '../../utils/redis';
import { UserService } from '../services/userService';

const router: Router = Router();
const redisClient = createRedisClient();
const userService = UserService;

const userController = UserController(userService, redisClient);

router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', authMiddleware, userController.deleteUser);
router.get('/get/all', authMiddleware, userController.getAllUser);
router.get('/get/accountNumber', authMiddleware, userController.getUserByAccountNumber);
router.get('/get/identityNumber', authMiddleware, userController.getUserByIdentityNumber);

export default router;