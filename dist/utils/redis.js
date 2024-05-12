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
const ioredis_1 = __importDefault(require("ioredis"));
exports.createRedisClient = () => {
    const client = new ioredis_1.default(`redis://localhost:6379`);
    client.select(process.env.REDIS_DB || 0);
    client.on('error', (err) => console.log(`Create redis client has an error: ${err}`));
    console.log(" connect to redis ");
    return client;
};
exports.redisHGet = (client, key, field) => __awaiter(void 0, void 0, void 0, function* () {
    const retrieved = yield client.hget(key, field);
    if (retrieved) {
        try {
            return JSON.parse(retrieved);
        }
        catch (e) {
            return null;
        }
    }
});
exports.redisHSet = (client, key, field, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.hset(key, field, data);
});
exports.redisHDel = (client, key, field) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.hdel(key, field);
});
