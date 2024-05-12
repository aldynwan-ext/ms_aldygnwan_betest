import { v4 as uuidv4 } from 'uuid';
import { IUser, IAuth, UserCollection, AuthCollection } from '../models/User';
import { comparePassword, hashPassword } from '../../utils/utils';
import mongoose from 'mongoose';
import Redis from 'ioredis';

export interface IUserService {
  createUser(userData: IUser, accountData: IAuth, redisClient: Redis): Promise<IUser>;
  updateUser(idParam: string, userData: IUser, redisClient: Redis): Promise<IUser | null>;
  deleteUser(idParam: string, redisClient: Redis): Promise<IUser | null>;
  getAllUser(redisClient: Redis): Promise<IUser[] | null>;
  getUserByAccountNumber(accNumber: string, redisClient: Redis): Promise<IUser | null>;
  getUserByIdentityNumber(idNumber: string, redisClient: Redis): Promise<IUser | null>;
  findAccountForLogin(userNameOrEmail: string, password: string): Promise<IAuth | null>
}

export const UserService: IUserService = {
  async createUser(userData: IUser, accountData: IAuth, redisClient: Redis): Promise<IUser> {
    const timeNow = Math.floor(Date.now()/1000)
    const userID:string = uuidv4()
    // users
    userData.id = userID
    userData.createdAt = timeNow
  
    // accounts
    const encryptedPassword = await hashPassword(accountData.password)
    accountData.userID = userID
    accountData.password = encryptedPassword
    accountData.createdAt = timeNow
  
    // transactional
    const session = await mongoose.startSession();
    session.startTransaction()
  
    try {
      const opts = { session };
  
      // Save to collection 1
      await UserCollection.create([userData], opts);
  
      // Save to collection 2
      await AuthCollection.create([accountData], opts);
  
      await session.commitTransaction();
      session.endSession();

      // if saving success, delete current caching data
      await redisClient.hdel("repo:users", "all");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    return userData
  },

  async updateUser(idParam: string, userData: IUser, redisClient: Redis): Promise<IUser | null> {
    try {
      userData.updatedAt = Math.floor(Date.now() / 1000)
     const res = await UserCollection.findOneAndUpdate({id: idParam}, {$set: userData}, {new: true});
     // if update successful, delete current caching
     if (res) {
       await redisClient.hdel("repo:users", "all");
       // dont need to find the previous acc and identity number since it is unique
       await redisClient.hdel("repo:users_account", res.accountNumber.toString())
       await redisClient.hdel("repo:users_identity", res.identityNumber.toString())
     }
     return res
    } catch (error: any) {
      throw new Error(`Update User has an error: ${error?.message}`)
    }
  },
  
  async deleteUser(idParam: string, redisClient: Redis): Promise<IUser | null> {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
      const opts = { session };
      // delete user
      const resUser = await UserCollection.findOneAndDelete({id: idParam}, opts);
      // delete account
      await AuthCollection.findOneAndDelete({userID: idParam}, opts)
      await session.commitTransaction();
      session.endSession();

      // if delete successful, delete current caching
     if (resUser) {
      await redisClient.hdel("repo:users", "all");
      // dont need to find the previous acc and identity number since it is unique
      await redisClient.hdel("repo:users_account", resUser.accountNumber.toString())
      await redisClient.hdel("repo:users_identity", resUser.identityNumber.toString())
    }
      return resUser
    } catch (error: any) {
      throw new Error(`Delete User has an error ${error?.message}`)
    }
  },

  async getAllUser(redisClient: Redis): Promise<IUser[]> {
    try {
      // find from redis first
      const dataRedis = await redisClient.hget("repo:users", "all");
      if (dataRedis) {
        const result: IUser[] = JSON.parse(dataRedis);
        return result
      }
      const allUsers :IUser[] = await UserCollection.find();
      if (allUsers.length > 0) {
        // save to redis
        await redisClient.hset("repo:users", "all", JSON.stringify(allUsers));
      }
      return allUsers;
    }  catch (error: any) {
      throw new Error(`Get All User has an error: ${error?.messsage}`)
    }
  },
  
  async getUserByAccountNumber(accNumber: string, redisClient: Redis): Promise<IUser | null> {
    try {
      // find from redis first
      const dataRedis = await redisClient.hget("repo:users_account", accNumber);
      if (dataRedis) {
        const result: IUser = JSON.parse(dataRedis);
        return result
      }
      const userData :IUser | null = await UserCollection.findOne({accountNumber: parseInt(accNumber)})
      if (userData) {
        // save to redis
        await redisClient.hset("repo:users_account", accNumber, JSON.stringify(userData));
      }
      return userData;
    } catch (error: any) {
      throw new Error(`Get User By Account Number has an error: ${error?.message}`)
    }
  },
  
  async getUserByIdentityNumber(idNumber: string, redisClient: Redis): Promise<IUser | null> {
    try {
       // find from redis first
       const dataRedis = await redisClient.hget("repo:users_identity", idNumber);
       if (dataRedis) {
         const result: IUser = JSON.parse(dataRedis);
         return result
       }
      const userData :IUser | null = await UserCollection.findOne({identityNumber: parseInt(idNumber)})
      if (userData) {
        await redisClient.hset("repo:users_identity", idNumber, JSON.stringify(userData));
      }
      return userData;
    } catch (error: any) {
      throw new Error(`Get User By Identity Number has an error: ${error?.message}`)
    }
  },
  
  async findAccountForLogin(userNameOrEmail: string, password: string): Promise<IAuth | null> {
    try {
      const accountData: IAuth | null = await AuthCollection.findOne({
        $or: [{ userName: userNameOrEmail }, { emailAddress: userNameOrEmail }]
      });
      if (!accountData) {
        return null
      }
      const passwordMatch = await comparePassword(password, accountData.password)
      if (!passwordMatch) {
        return null
      }
      return accountData
    } catch (error: any) {
      throw new Error(`Find Account for Login has an error ${error?.message}`)
    }
  }
}