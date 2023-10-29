import express from "express";
import { z } from "zod";
import { amoCrmAxios, getOAuthUrl, getTokensByCode } from "../services/index.js";
import { isAxiosError } from "axios";

const amoCrmRouter = express.Router();

const amoCrmRedirectResponse = z.object({
  code: z.string(),
  state: z.string(),
  referer: z.string(),
  platform: z.string(),
  client_id: z.string(),
});


amoCrmRouter.get("/leads", async function (req, res) {
  try {
    const { data } = await amoCrmAxios.get('/leads');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

amoCrmRouter.get("/account", async function (req, res) {
  const data = await amoCrmAxios.get<{ [key: string]: any }>('/account')
    .then((res) => res.data)
    .catch((error) => {
      if (isAxiosError(error)) console.error("/account", error.response?.data);
      return null;
    });
  res.json(data);
});

amoCrmRouter.get("/redirect", async function (req, res) {
  const parseResult = amoCrmRedirectResponse.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error);
    return;
  }

  console.log(`GET /amocrm/redirect => ${JSON.stringify(parseResult.data, null, 2)}`);

  const tokens = await getTokensByCode(parseResult.data.code).catch(() => null);
  if (!tokens) {
    res.status(400).json({ error: 'No tokens' });
    return;
  }
  return res.redirect('/admin');
});

amoCrmRouter.get("/login", async function (req, res) {
  const loginUrl = await getOAuthUrl();
  // res.redirect(loginUrl);
  res.send({ loginUrl });
});

export default amoCrmRouter;