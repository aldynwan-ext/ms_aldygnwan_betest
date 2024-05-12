// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// users
export interface IUser extends Document {
  id: string;
  userName: string;
  accountNumber: Number;
  emailAddress: string;
  identityNumber: Number;
  createdAt: Number;
  updatedAt: Number;
  deletedAt: Number;
}

const userSchema: Schema = new mongoose.Schema({
  id: { type: String, required: true},
  userName: { type: String, unique: true, required: true },
  accountNumber: { type: Number, unique: true, required: true},
  emailAddress: { type: String, unique: true, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  identityNumber: { type: Number, unique: true, required: true},
  createdAt: { type: Number },
  updatedAt: { type: Number },
  deletedAt: { type: Number },
}, {
  collection: 'users'
});

userSchema.index({userName: 1});
userSchema.index({emailAddress: 1});
userSchema.index({accountNumber: 1});
userSchema.index({identityNumber: 1});

const UserCollection = mongoose.model<IUser>('User', userSchema)

// auth
export interface IAuth extends Document {
  userID: string;
  emailAddress: string;
  userName: string;
  password: string;
  createdAt: Number;
}

const authSchema: Schema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true},
  emailAddress: { type: String, required: true, unique: true},
  userName: { type: String, required: true, unique: true},
  password: { type: String, required: true, unique: true},
  createdAt: { type: Number }
}, {
  collection: 'accounts'
});

authSchema.index({userName: 1});
authSchema.index({emailAddress: 1});

const AuthCollection = mongoose.model<IAuth>('Auth', authSchema)
export { UserCollection, AuthCollection}