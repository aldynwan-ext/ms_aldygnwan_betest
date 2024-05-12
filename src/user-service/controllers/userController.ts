import { Request, Response } from 'express';
import { IUser, UserCollection, AuthCollection } from '../models/User';
import {IUserService} from '../services/userService';
import { generateToken } from '../../utils/utils';
import Redis from 'ioredis';

interface UserResponse {
  success: boolean;
  message: string;
  data: IUser | null;
}

interface AllUserResponse {
  success: boolean;
  message: string;
  data: IUser[] | null;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export const UserController = (userService: IUserService, redisClient: Redis) => ({
  createUser: async(req: Request, res: Response) => {
    let resp: UserResponse = {
      success: false,
      message: "",
      data: null,
    }
    const userParam = new UserCollection(req.body);
    const accountParam = new AuthCollection(req.body)
    try {
      // create user and account
      const user = await userService.createUser(userParam, accountParam, redisClient);
      resp.success = true
      resp.message = "success"
      resp.data = user
      res.status(201).json(resp);
      return
    } catch (error:any) {
      resp.message = error?.message
      res.status(500).json(resp);
    }
  },
  
  updateUser: async(req: Request, res: Response)=> {
    let resp: UserResponse = {
      success: false,
      message: "",
      data: null
    }
    try {
      const user = await userService.updateUser(req.params.id, req.body, redisClient);
      if (!user) {
        resp.message = "User not Found!"
        res.status(201).json(resp)
        return
      }
      resp.success = true
      resp.message = "success"
      resp.data = user
      res.status(201).json(resp)
      return
    } catch(error: any) {
      const resp :UserResponse = {
        success: false,
        message: error?.message,
        data: null,
      }
      res.status(500).json(resp)
    }
  },
  
  deleteUser: async(req: Request, res: Response)=> {
    let resp: UserResponse = {
      success: false,
      message: "",
      data: null
    }
    try {
      // delete user and account
      const reqParam = req.params.id as string | undefined
      if (!reqParam) {
        resp.message = "User ID is Required!"
        res.status(400).json(resp)
        return
      }
      const userID = reqParam
      const userData = await userService.deleteUser(userID, redisClient)
      if (!userData) {
        resp.message = "No User Found!"
        res.status(201).json(resp)
        return
      }
      resp.success = true
      resp.message = "success"
      resp.data = userData
      res.status(201).json(resp)
      return
    } catch (error: any){
      resp.message = error?.message
      res.status(500).json(resp)
    }
  },
  
  getAllUser: async(req: Request, res: Response)=> {
    let resp: AllUserResponse = {
      success: false,
      message: "",
      data: null,
    }
    try {
      const allUser = await userService.getAllUser(redisClient);
      if (allUser?.length == 0) {
        resp.message = "There are No User Registered!"
        res.status(201).json(resp)
        return
      }
      resp.success = true
      resp.message = "success"
      resp.data = allUser
      res.status(201).json(resp);
    } catch (error: any) {
      resp.message = error?.message
      res.status(500).json(resp);
    }
  },
  
  getUserByAccountNumber: async(req: Request, res: Response)=> {
    let resp: UserResponse = {
      success: false,
      message: "",
      data: null,
    }
    try {
      const reqParam = req.query.accountNumber as string | undefined
      if (!reqParam) {
        resp.message = "Account Number is Required!"
        res.status(400).json(resp)
        return
      }
      const accountNumber = reqParam
      const userData = await userService.getUserByAccountNumber(accountNumber, redisClient);
      if (!userData) {
        resp.message = "No User Found!"
        res.status(201).json(resp)
        return
      }
      resp.success = true
      resp.message = "success"
      resp.data = userData
      res.status(201).json(resp)
    } catch (error: any) {
      resp.message = error?.message
      res.status(500).json(resp);
    }
  },
  
  getUserByIdentityNumber: async(req: Request, res: Response)=> {
    let resp: UserResponse = {
      success: false,
      message: "",
      data: null
    }
    try {
      const reqParam = req.query.identityNumber as string | undefined
      if (!reqParam) {
        resp.message = "Identity Number is Required!"
        res.status(400).json(resp)
        return
      }
      const identityNumber = reqParam
      const userData = await userService.getUserByIdentityNumber(identityNumber, redisClient);
      if (!userData) {
        resp.message = "No User Found!"
        res.status(201).json(resp)
        return
      }
      resp.success = true
      resp.message = "success"
      resp.data = userData
      res.status(201).json(resp)
    } catch (error: any) {
      resp.message = error?.message
      res.status(500).json(resp);
    }
  },
  
  login: async(req: Request, res: Response)=> {
    // if login success, get token
    let resp: LoginResponse = {
      success: false,
      message: "",
      token: ""
    }
    const { userOrEmail, password } = req.body
    if (!userOrEmail) {
      resp.message = "Email or Username is Required"
      res.status(400).json(resp)
      return
    }
    if (!password) {
      resp.message = "Password is Required!"
      res.status(400).json(resp)
      return
    }
    try {
      // find data in account collection
      const account = await userService.findAccountForLogin(userOrEmail, password)
      if (!account) {
        resp.message = "Account not found! Please check your Email/Username and Password."
        res.status(400).json(resp)
        return
      }
      // if account is found, then generate token
      const token = generateToken({userID: account.userID, userName: account.userName})
      resp.success = true
      resp.message = "success"
      resp.token = token
      res.status(201).json(resp)
      return
    } catch (error: any) {
      resp.message = error?.message
      res.status(500).json(resp)
    }
  }
})