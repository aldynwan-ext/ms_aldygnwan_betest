import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {    
    // Set the allowed methods for CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Set other CORS headers as needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');

    next();
};