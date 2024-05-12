import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const comparePassword = async(password: string, dataPassword: string): Promise<boolean> => {
    const passwordMatch = await bcrypt.compare(password, dataPassword)
    return passwordMatch
}

const JWT_SECRET = 'aldygunawan';

export const generateToken = (payload: any): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Bearer token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
    } else {
        try {
            const decoded = verifyToken(token);
            // this token contains userID and userName
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};