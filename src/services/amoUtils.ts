import axios, { isAxiosError } from "axios";
import { env } from "../env.js";
import { ITokens, Tokens } from "../models/Tokens.js";
// import amoCrmClient from "./amoCrmClient.js";

export const getOAuthUrl = async (): Promise<string> => {
  return `https://www.amocrm.ru/oauth?client_id=${env.AMO_CRM_CLIENT_ID}&mode=popup&state=state`;
}

export const getTokens = async (): Promise<ITokens | null> => {
  // const tokens = amoCrmClient.token.getValue() ?? null;

  // return updateTokens(tokens);
  const dbTokens = await Tokens.findOne({ slug: 'admin' });
  console.log("getTokens", { dbTokens });
  return dbTokens?.toJSON() ?? null;
}

export const updateTokens = async (tokens: Omit<ITokens, '_id' | 'slug'> | null): Promise<ITokens | null> => {

  if (!tokens) {
    await Tokens.deleteOne({ slug: 'admin' });
    return null;
  }

  const dbTokens = await Tokens.findOneAndUpdate({ slug: 'admin' }, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_type: tokens.token_type,
    expires_in: tokens.expires_in,
  }, { upsert: true });

  return dbTokens?.toJSON() ?? null;
}

export const getTokensByCode = async (code: string): Promise<ITokens | null> => {

  // amoCrmClient.auth.setCode(code);
  // const tokens = await amoCrmClient.token.fetch().catch(error => {
  //   console.log("getTokensByCode error", error);
  //   return null;
  // }) ?? null;

  console.log("getTokensByCode", {
    client_id: env.AMO_CRM_CLIENT_ID,
    client_secret: env.AMO_CRM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.AMO_CRM_REDIRECT_URL,
  });
  const tokens = await axios.post<Omit<ITokens, '_id' | 'slug'>>(`https://${env.AMO_CRM_DOMAIN}/oauth2/access_token`, {
    client_id: env.AMO_CRM_CLIENT_ID,
    client_secret: env.AMO_CRM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.AMO_CRM_REDIRECT_URL,
  }).then((res) => res.data)
    .catch((error) => {
      if (isAxiosError(error)) console.error("getTokensByCode error", error.response?.data);
      console.log("getTokensByCode error", error.toString());
      return null;
    });

  console.log("getTokensByCode", { tokens });

  return updateTokens(tokens);
}

export const refreshTokens = async (): Promise<ITokens | null> => {
  // const refreshedTokens = await amoCrmClient.token.refresh().catch(error => {
  //   console.log("refreshTokens error", error);
  //   return null;
  // }) ?? null;
  const oldTokens = await getTokens();
  console.log("Refresh tokens", { oldTokens, code: env.AMO_CRM_CODE });
  if (!oldTokens) {
    if (!env.AMO_CRM_CODE) return null;

    return getTokensByCode(env.AMO_CRM_CODE);
  }

  const refreshedTokens = await axios.post<Omit<ITokens, '_id' | 'slug'>>(`https://${env.AMO_CRM_DOMAIN}/oauth2/access_token`, {
    client_id: env.AMO_CRM_CLIENT_ID,
    client_secret: env.AMO_CRM_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: oldTokens?.refresh_token,
    redirect_uri: env.AMO_CRM_REDIRECT_URL,
  }).then((res) => res.data)
    .catch((error) => {
      if (isAxiosError(error)) console.error("refresh error", error.response?.data);
      console.log("refresh error", error.toString());
      return null;
    });

  console.log("Refresh tokens", { refreshedTokens });

  return updateTokens(refreshedTokens);
}
