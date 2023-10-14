import axios from 'axios';
import { env } from '../env.js';
import amoCrmClient from './amoCrmClient.js';
import { Tokens } from '../models/Tokens.js';

export const amoCrmAxios = axios.create({
  baseURL: `https://${env.AMO_CRM_DOMAIN}/api/v4`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

amoCrmAxios.interceptors.request.use((config) => {
  try {
    const tokens = amoCrmClient.token.getValue();
    if (tokens) {
      config.headers['Authorization'] = `Bearer ${tokens.access_token}`;
    }
    return config;
  } catch (error) {
    console.error(error);
    return config;
  }
});

amoCrmAxios.interceptors.response.use(
  response => response,
  async (error) => {
    try {
      if (error.response.status === 401) {
        const dbTokens = await Tokens.findOne({ slug: 'admin' });
        console.log('dbTokens:', dbTokens?.toJSON());

        if (dbTokens) {
          amoCrmClient.token.setValue({
            access_token: dbTokens.access_token,
            refresh_token: dbTokens.refresh_token,
            token_type: dbTokens.token_type,
            expires_in: dbTokens.expires_in,
            expires_at: dbTokens.expires_at,
          });
          console.log('amoCrmClient.token.getValue():', amoCrmClient.token.getValue());
        }

        try {
          await amoCrmClient.token.refresh();
        } catch (error) {

        }
        const tokens = amoCrmClient.token.getValue();

        if (!tokens) {
          return Promise.reject(error);
        }

        console.log('tokens:', tokens)

        await Tokens.findOneAndUpdate({ slug: 'admin' }, {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
          expires_in: tokens.expires_in,
          expires_at: tokens.expires_at,
        }, { upsert: true });

        error.config.headers['Authorization'] = `Bearer ${tokens.access_token}`;
        return axios.request(error.config);
      }
      return Promise.reject(error);
    } catch (e) {
      console.error(error);
      return Promise.reject(error);
    }
  }
);
