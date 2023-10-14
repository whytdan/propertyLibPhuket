import { z } from 'zod';
import { createEnv } from './utils/createEnv.js';
import dotenv from 'dotenv';

dotenv.config();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.string().transform(val => parseInt(val)),
    HOST: z.string().default('localhost'),

    DATABASE_URL: z.string().min(1),

    ADMIN_USER_EMAIL: z.string().email(),
    ADMIN_USER_PASSWORD: z.string().min(1),

    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET: z.string().min(1),

    AMO_CRM_DOMAIN: z.string().min(1),
    AMO_CRM_CLIENT_ID: z.string().min(1),
    AMO_CRM_CLIENT_SECRET: z.string().min(1),
    AMO_CRM_REDIRECT_URL: z.string().min(1),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HOST: process.env.HOST,

    DATABASE_URL: process.env.DATABASE_URL,

    ADMIN_USER_EMAIL: process.env.ADMIN_USER_EMAIL,
    ADMIN_USER_PASSWORD: process.env.ADMIN_USER_PASSWORD,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,

    AMO_CRM_DOMAIN: process.env.AMO_CRM_DOMAIN,
    AMO_CRM_CLIENT_ID: process.env.AMO_CRM_CLIENT_ID,
    AMO_CRM_CLIENT_SECRET: process.env.AMO_CRM_CLIENT_SECRET,
    AMO_CRM_REDIRECT_URL: process.env.AMO_CRM_REDIRECT_URL,
  }
})

console.log(JSON.stringify(env, null, 2));