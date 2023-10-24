import { z } from "zod";

const numberParamSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val ? parseFloat(val) : undefined;
  }
  return val;
}, z.number().optional());
const booleanParamSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    // return val ? val === 'true' : val === 'false' ? false : true;
    switch (val) {
      case 'true':
      case '1':
      case '':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        return undefined;
    }
  }
  return val;
}, z.boolean().optional());

export const filterSchema = z.object({
  _page: numberParamSchema.default(1),
  _limit: numberParamSchema.default(10),
  isRent: booleanParamSchema,
  isVilla: booleanParamSchema,
  isApartment: booleanParamSchema,
  isPriorityBuilding: booleanParamSchema,
  location: z.string().optional(),
  badroomsAmount_gte: numberParamSchema,
  badroomsAmount_lte: numberParamSchema,
  builtUpArea_gte: numberParamSchema,
  builtUpArea_lte: numberParamSchema,
  landArea_gte: numberParamSchema,
  landArea_lte: numberParamSchema,
  price_gte: numberParamSchema,
  price_lte: numberParamSchema,
});


export type FilterParams = z.infer<typeof filterSchema>;
