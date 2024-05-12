import Redis from 'ioredis';

export const createRedisClient = (): Redis => {
    const client = new Redis(`redis://localhost:6379`);
    client.select(process.env.REDIS_DB || 0);
    client.on('error', (err) =>  console.log(`Create redis client has an error: ${err}`));
    console.log(" connect to redis ")
    return client;
};

export const redisHGet = async (client: Redis, key: string, field: string): Promise<any> => {
    const retrieved = await client.hget(key, field);
    if (retrieved) {
        try {
            return JSON.parse(retrieved);
        } catch (e: any) {
            return null
        }
    }
};

export const redisHSet = async(client: Redis, key: string, field: string, data: string): Promise<any> => {
    return await client.hset(key, field, data);
}

export const redisHDel = async(client: Redis, key: string, field: string): Promise<any> => {
    return await client.hdel(key, field);
}