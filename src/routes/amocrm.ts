import express from "express";
import { z } from "zod";
import { amoCrmAxios, amoCrmClient } from "../services/index.js";
import { Tokens } from "../models/Tokens.js";

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
  try {
    const { data } = await amoCrmAxios.get('/account');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

amoCrmRouter.get("/redirect", async function (req, res) {
  const parseResult = amoCrmRedirectResponse.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error);
    return;
  }
  console.log(`GET /amocrm/redirect => ${JSON.stringify(parseResult.data, null, 2)}`);
  amoCrmClient.auth.setCode(parseResult.data.code);
  try {
    const tokens = await amoCrmClient.token.fetch();
    if (!tokens) {
      res.status(400).json({ error: 'No tokens' });
      return;
    }

    const data = await Tokens.findOneAndUpdate({ slug: 'admin' }, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expires_in: tokens.expires_in,
      expires_at: tokens.expires_at,
    }, { upsert: true });

    return res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

amoCrmRouter.get("/loginUrl", async function (req, res) {
  console.log(`POST /amocrm/login => ${JSON.stringify(req.body)}`);
  const loginUrl = amoCrmClient.auth.getUrl();
  res.json({ loginUrl });
});

export default amoCrmRouter;