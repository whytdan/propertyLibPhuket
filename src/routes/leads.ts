import express from "express";
import { z } from "zod";
import zodValidatorMildderware from "../middlewares/zodValidator.middleware.js";
import { amoCrmAxios } from "../services/index.js";
import { isAxiosError } from "axios";

const leadsRouter = express.Router();

const leadSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  comment: z.string(),
  buy: z.boolean(),
  post: z.boolean(),
  rent: z.boolean(),
  other: z.boolean(),
});

// const data = {
//   "fullName": "Test 123",
//   "phoneNumber": "996555555555",
//   "comment": "Test 123",
//   "buy": true,
//   "post": true,
//   "rent": true,
//   "other": true
// }

const customContactFields = {
  phoneNumber: {
    id: 101593,
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
  }
};

const customLeadFields = {
  comment: {
    id: 356807,
    field_name: "Комментарий",
  },
  type: {
    id: 356809,
    field_name: "Тип сделки",
    enums: {
      BUY: 197071,
      POST: 440111,
      RENT: 440113,
      OTHER: 440115,
    },
  },
}

const tags = {
  site: 18485,
} as const

type CreateContactResponse = {
  _embedded: {
    contacts: { id: number }[]
  },
}

leadsRouter.post(
  "/",
  zodValidatorMildderware(leadSchema),
  async function (req, res) {
    const body = req.body as z.infer<typeof leadSchema>;
    try {
      const contact = await amoCrmAxios.post<CreateContactResponse>("/contacts",
        [
          {
            name: body.fullName,
            custom_fields_values: [
              {
                field_id: customContactFields.phoneNumber.id,
                values: [
                  {
                    value: body.phoneNumber,
                    enum_id: customContactFields.phoneNumber.enums.WORK,
                  }
                ],
              },
            ],
            _embedded: {
              tags: [
                { id: tags.site },
              ]
            }
          }
        ]).then((res) => res.data._embedded.contacts[0] ?? null);

      if (!contact) return res.status(500).json({ error: "Internal Server Error" });

      console.log("contact:", JSON.stringify(contact, null, 2));

      const types: { enum_id: number }[] = [];
      if (body.buy) types.push({ enum_id: customLeadFields.type.enums.BUY });
      if (body.post) types.push({ enum_id: customLeadFields.type.enums.POST });
      if (body.rent) types.push({ enum_id: customLeadFields.type.enums.RENT });
      if (body.other) types.push({ enum_id: customLeadFields.type.enums.OTHER });

      const { data } = await amoCrmAxios.post("/leads", [
        {
          name: body.fullName,
          custom_fields_values: [
            {
              field_id: customLeadFields.comment.id,
              values: [{ value: body.comment }],
            },
            {
              field_id: customLeadFields.type.id,
              values: types,
            },
          ],
          _embedded: {
            contacts: [
              {
                id: contact.id,
                is_main: true,
              }
            ],
            tags: [
              { id: tags.site },
            ]
          }
        }
      ]);

      console.log("response:", JSON.stringify(data, null, 2));

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

export default leadsRouter;
