import { Document } from "mongoose";
import { IRealEstate, IRealEstateWithImages } from "../models/RealEstate.js";
import { getImageUrl } from "./getImageUrl.js";


export const formatRealEstate = async (realEstate: Document<unknown, {}, IRealEstate> & IRealEstate): Promise<IRealEstateWithImages> => {
  const mainImageUrl = realEstate.mainImage?.key ? await getImageUrl(realEstate.mainImage.key) : null;
  const realEstateImages = (await Promise.all(realEstate.images.key.filter(Boolean).map(getImageUrl))).map(url => ({ url: url ?? '' }));

  return {
    ...realEstate.toObject(),
    mainImage: { url: mainImageUrl ?? '' },
    images: realEstateImages,
  };
}