import axios, { isAxiosError } from 'axios';
import { env } from '../env.js';
import { getTokens, refreshTokens } from './amoUtils.js';

export const amoCrmAxios = axios.create({
  baseURL: `https://${env.AMO_CRM_DOMAIN}/api/v4`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

amoCrmAxios.interceptors.request.use(async (config) => {
  try {
    const dbTokens = await getTokens().catch(() => null);
    if (dbTokens) {
      config.headers['Authorization'] = `Bearer ${dbTokens.access_token}`;
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
    if (!isAxiosError(error)) return Promise.reject(error);
    try {
      if (error.response?.status === 401) {
        const tokens = await refreshTokens().catch(() => null);
        if (!tokens) return Promise.reject(error);
        console.log("Tokens Refreshed!!");
        const subResponse = await axios.request({
          ...(error.config ?? {}),
          headers: {
            ...(error.config?.headers ?? {}),
            Authorization: `Bearer ${tokens.access_token}`,
          }
        });
        console.log("subResponse", subResponse.data);

        return Promise.resolve(subResponse);
      }
      return Promise.reject(error);
    } catch (e) {
      console.error(error);
      return Promise.reject(error);
    }
  }
);
