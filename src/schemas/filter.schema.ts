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



export type _Filter = {
  _page: number,
  _limit: number,
  isVilla: boolean,
  isApartment: boolean,
  isPriorityBuilding: boolean,
  location: string,
  badroomsAmount_gte: number,
  badroomsAmount_lte: number,
  builtUpArea_gte: number,
  builtUpArea_lte: number,
  landArea_gte: number,
  landArea_lte: number,
  price_gte: number,
  price_lte: number,
};

export type FilterParams = z.infer<typeof filterSchema>;
