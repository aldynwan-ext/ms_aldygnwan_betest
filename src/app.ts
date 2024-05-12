import express, { Request, Response } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { corsMiddleware } from './corsMiddleware';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(corsMiddleware);

// Using Rest to Rest method
// Route handler to call API of service users
app.post('/api/create', async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.post('http://localhost:3001/users/create', req.body);
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Create Users API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.post('http://localhost:3001/users/login', req.body);
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Login Users API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.put('/api/update/:id', async (req: Request, res: Response) => {
    const userID = req.params.id;
    try {
        const response: AxiosResponse = await axios.put(`http://localhost:3001/users/update/${userID}`, 
        req.body);
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Update Users API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/delete/:id', async (req: Request, res: Response) => {
    const userID = req.params.id;
    try {
        const response: AxiosResponse = await axios.delete(`http://localhost:3001/users/delete/${userID}`, {headers: req.headers});
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Delete Users API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.get('/api/get/all', async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.get('http://localhost:3001/users/get/all', { headers: req.headers });
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Get All Users API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.get('/api/get/accountNumber', async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.get('http://localhost:3001/users/get/accountNumber', {
            params: req.query,
            headers: req.headers,
        });
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Get Users by Account Number API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.get('/api/get/identityNumber', async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.get('http://localhost:3001/users/get/identityNumber', {
            params: req.query,
            headers: req.headers,
        });
        res.json(response.data);
    } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error calling Get Users by Identity Number API:', err.message);
        res.status(err.response?.status || 500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Main application is running on port ${PORT}`);
});

export default app;