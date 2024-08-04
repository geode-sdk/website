import * as privateEnv from '$env/static/private';
import { createClient } from 'redis'

const redisUrl = "PRIVATE_REDIS_URL" in privateEnv &&
	typeof privateEnv.PRIVATE_REDIS_URL == "string"
	? privateEnv.PRIVATE_REDIS_URL
	: null;

export const redis = redisUrl
	? createClient({ url: redisUrl })
	: null;

await redis?.connect()
