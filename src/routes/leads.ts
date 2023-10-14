import express from 'express';
import { z } from 'zod';
import zodValidatorMildderware from '../middlewares/zodValidator.middleware.js';
import { amoCrmAxios } from '../services/index.js';

const router = express.Router();

const leadSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  comment: z.string(),
  buy: z.boolean(),
  post: z.boolean(),
  rent: z.boolean(),
  other: z.boolean(),
});

router.post('/', zodValidatorMildderware(leadSchema), async function (req, res) {
  const body = req.body as z.infer<typeof leadSchema>;
  try {
    const { data } = await amoCrmAxios.post('/leads', {
      name: body.fullName,
      custom_fields_values: [
        { phoneNumber: body.phoneNumber || '' },
        { comment: body.comment || '' },
        { buy: Boolean(body.buy) },
        { post: Boolean(body.post) },
        { rent: Boolean(body.rent) },
        { other: Boolean(body.other) },
      ],
    });

    console.log('response:', data);

    res.json(data);
  } catch (error) {
    console.error(`error in lead creation: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async function (req, res) {
  try {
    const { data } = await amoCrmAxios.get('/leads');
    res.json(data);
  } catch (error) {
    console.error(`error in lead list request: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
