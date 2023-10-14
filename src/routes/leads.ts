import express from "express";
import { z } from "zod";
import zodValidatorMildderware from "../middlewares/zodValidator.middleware.js";
import { amoCrmAxios } from "../services/index.js";
import { isAxiosError } from "axios";

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

const customContactFields = {
  phoneNumber: {
    id: 101595,
    field_name: "Телефон",
    enums: {
      WORK: 55255,
      WORKDD: 55257,
      MOB: 55259,
      FAX: 55261,
      HOME: 55263,
      OTHER: 55265,
    },
  },
  email: {
    id: 101595,
    field_name: "Email",
    enums: {
      WORK: 55267,
      PRIV: 55269,
      OTHER: 55271,
    },
  },
};

router.post(
  "/",
  zodValidatorMildderware(leadSchema),
  async function (req, res) {
    const body = req.body as z.infer<typeof leadSchema>;
    try {
      const { data: contact } = await amoCrmAxios.post("/contacts", {
        name: [body.fullName],
        first_name: [body.fullName],
        phone: [body.phoneNumber],
        custom_fields_values: [
          {
            field_id: customContactFields.phoneNumber.id,
            values: [
              {
                value: body.phoneNumber,
                enum_id: customContactFields.phoneNumber.enums.WORK,
              },
              {
                value: body.comment,
                enum_id: customContactFields.phoneNumber.enums.WORK,
              },
            ],
          },
        ],
      });

      const { data } = await amoCrmAxios.post("/leads", {
        name: [body.fullName],
        account_id: contact?.account_id,
        phone: [body.phoneNumber],
      });

      console.log("response:", data);

      res.json(data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`error in lead creation: ${error}`);
        return res
          .status(error.response?.status ?? 500)
          .json(error.response?.data ?? { error: "Internal Server Error" });
      }
      console.error(`error in lead creation: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/", async function (req, res) {
  try {
    const { data } = await amoCrmAxios.get("/leads");
    res.json(data);
  } catch (error) {
    console.error(`error in lead list request: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/custom_fields", async function (req, res) {
  try {
    console.log("get custom fields");
    const { data: leadsCustomFields } = await amoCrmAxios.get(
      "/leads/custom_fields"
    );
    const { data: contactsCustomFields } = await amoCrmAxios.get(
      "/contacts/custom_fields"
    );
    const { data: companiesCustomFields } = await amoCrmAxios.get(
      "/companies/custom_fields"
    );
    res.json({
      leadsCustomFields,
      contactsCustomFields,
      companiesCustomFields,
    });
  } catch (error) {
    console.error(`error in lead custom fields request: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
