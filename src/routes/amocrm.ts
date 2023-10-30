import express from "express";
import { z } from "zod";
import { getOAuthUrl, getTokensByCode } from "../services/index.js";

const amoCrmRouter = express.Router();

const amoCrmRedirectResponse = z.object({
  code: z.string(),
  state: z.string(),
  referer: z.string(),
  platform: z.string(),
  client_id: z.string(),
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
  res.redirect(loginUrl);
  // res.send({ loginUrl });
});

export default amoCrmRouter;