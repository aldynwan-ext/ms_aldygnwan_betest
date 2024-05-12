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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const corsMiddleware_1 = require("./corsMiddleware");
const app = express_1.default();
const PORT = 3000;
app.use(express_1.default.json());
app.use(corsMiddleware_1.corsMiddleware);
// Using Rest to Rest method
// Route handler to call API of service users
app.post('/api/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post('http://localhost:3001/users/create', req.body);
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Create Users API:', err.message);
        res.status(((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const response = yield axios_1.default.post('http://localhost:3001/users/login', req.body);
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Login Users API:', err.message);
        res.status(((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.put('/api/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userID = req.params.id;
    try {
        const response = yield axios_1.default.put(`http://localhost:3001/users/update/${userID}`, req.body);
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Update Users API:', err.message);
        res.status(((_c = err.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.delete('/api/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userID = req.params.id;
    try {
        const response = yield axios_1.default.delete(`http://localhost:3001/users/delete/${userID}`, { headers: req.headers });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Delete Users API:', err.message);
        res.status(((_d = err.response) === null || _d === void 0 ? void 0 : _d.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.get('/api/get/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const response = yield axios_1.default.get('http://localhost:3001/users/get/all', { headers: req.headers });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Get All Users API:', err.message);
        res.status(((_e = err.response) === null || _e === void 0 ? void 0 : _e.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.get('/api/get/accountNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const response = yield axios_1.default.get('http://localhost:3001/users/get/accountNumber', {
            params: req.query,
            headers: req.headers,
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Get Users by Account Number API:', err.message);
        res.status(((_f = err.response) === null || _f === void 0 ? void 0 : _f.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.get('/api/get/identityNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const response = yield axios_1.default.get('http://localhost:3001/users/get/identityNumber', {
            params: req.query,
            headers: req.headers,
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        console.error('Error calling Get Users by Identity Number API:', err.message);
        res.status(((_g = err.response) === null || _g === void 0 ? void 0 : _g.status) || 500).json({ message: 'Internal server error' });
    }
}));
app.listen(PORT, () => {
    console.log(`Main application is running on port ${PORT}`);
});
exports.default = app;
