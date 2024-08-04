import * as privateEnv from "$env/static/private";
import { createClient } from "redis";

const redisUrl =
    "PRIVATE_REDIS_URL" in privateEnv &&
    typeof privateEnv.PRIVATE_REDIS_URL == "string"
        ? privateEnv.PRIVATE_REDIS_URL
        : null;

export const redis = redisUrl ? createClient({ url: redisUrl }) : null;

await redis?.connect();

async function asyncTimeout(timeoutMs: number) {
    return new Promise((r) => setTimeout(r, timeoutMs));
}

export async function redis_lock(id: string, timeoutMs = 5_000) {
    if (!redis) {
        return;
    }

    const initialWaitMs = 10;

    let timeWaited = 0;
    let iterations = 1;

    while (timeWaited < timeoutMs) {
        const waitPeriod = iterations * initialWaitMs;

        if (await redis.set(id, "lock", { NX: true, EX: timeoutMs / 1_000 })) {
            return;
        }

        await asyncTimeout(waitPeriod);

        timeWaited += waitPeriod;
        iterations++;
    }

    throw new Error(`failed to acquire lock: ${id}`);
}

export async function redis_unlock(id: string) {
    if (!redis) {
        return;
    }

    await redis.del(id);
}
