import express from 'express';
import amoCrmClient from '../services/amoCrm.js';

const router = express.Router();

router.post('/', async function (req, res) {
  try {
    const payload = req.body;
    console.log('lead payload:', payload);

    const { fullName, phoneNumber, comment, buy, post, rent, other } = payload;
    const lead = new amoCrmClient.Lead();

    console.log('lead:', lead);

    lead.name = fullName;

    lead.custom_fields_values = [
      { phoneNumber: phoneNumber || '' },
      { comment: comment || '' },
      { buy: Boolean(buy) },
      { post: Boolean(post) },
      {
        rent: Boolean(rent),
      },
      {
        other: Boolean(other),
      },
    ];

    const response = await lead.save();

    console.log('response:', response);

    res.json(response);
  } catch (error) {
    console.error(`error in lead creation: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
