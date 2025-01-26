import * as privateEnv from "$env/static/private";
import { createClient } from "redis";

const redisUrl =
    "PRIVATE_REDIS_URL" in privateEnv && typeof privateEnv.PRIVATE_REDIS_URL == "string"
        ? privateEnv.PRIVATE_REDIS_URL
        : null;

export const redis = redisUrl ? createClient({ url: redisUrl }) : null;

function formatError(e: Error) {
    return `${e.name}: ${e.message}`;
}

redis?.on("error", (e: Error) => {
    if (e instanceof AggregateError) {
        console.error(`Redis threw errors: ${e.errors.map((a) => formatError(a))}`);
    } else {
        console.error(`Redis threw error: ${formatError(e)}`);
    }
});

await redis?.connect();

async function asyncTimeout(timeoutMs: number) {
    return new Promise((r) => setTimeout(r, timeoutMs));
}

/**
 * waits for exclusive access to the database based on the given id. no effect is redis is not present
 * @param id cache key to use for lock
 * @param timeoutMs amount of time (ms) to wait before stopping and throwing an error
 */
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

/**
 * unlocks the exclusive access given in redis_lock. no effect if redis is not present
 * @param id cache key used in redis_lock
 */
export async function redis_unlock(id: string) {
    if (!redis) {
        return;
    }

    await redis.del(id);
}
