"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./database");
const corsMiddleware_1 = require("../corsMiddleware");
const app = express_1.default();
// Connect to MongoDB
database_1.connectToDatabase()
    .then(() => {
    app.use(express_1.default.json());
    app.use(corsMiddleware_1.corsMiddleware);
})
    .then(() => {
    // Routes
    app.use('/users', userRoutes_1.default);
})
    .then(() => {
    // Running port
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
exports.default = app;
