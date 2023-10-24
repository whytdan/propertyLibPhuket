import { FilterQuery } from "mongoose";
import { IRealEstate } from "../models/RealEstate.js";
import { FilterParams } from "../schemas/filter.schema.js";

type Query = FilterQuery<IRealEstate>

export const createFilterQuery = (params: FilterParams): Query => {
  const query: Query = {};
  if (params.isVilla != undefined) {
    query.isVilla = params.isVilla;
  }
  if (params.isApartment != undefined) {
    query.isApartment = params.isApartment;
  }
  if (params.isPriorityBuilding != undefined) {
    query.isPriorityBuilding = params.isPriorityBuilding;
  }
  if (params.isRent != undefined) {
    query.isRent = params.isRent;
  }
  if (params.location != undefined) {
    query.location = params.location;
  }
  if (params.badroomsAmount_gte != undefined) {
    query.badroomsAmountFrom = {
      $gte: params.badroomsAmount_gte,
    };
  }
  if (params.badroomsAmount_lte != undefined) {
    query.badroomsAmountTo = {
      $lte: params.badroomsAmount_lte,
    };
  }
  if (params.builtUpArea_gte != undefined) {
    query.builtUpAreaFrom = {
      $gte: params.builtUpArea_gte,
    };
  }
  if (params.builtUpArea_lte != undefined) {
    query.builtUpAreaTo = {
      $lte: params.builtUpArea_lte,
    };
  }
  if (params.landArea_gte != undefined) {
    query.landAreaFrom = {
      $gte: params.landArea_gte,
    };
  }
  if (params.landArea_lte != undefined) {
    query.landAreaTo = {
      $lte: params.landArea_lte,
    };
  }
  if (params.price_gte != undefined) {
    query.priceMillionBahtFrom = {
      $gte: params.price_gte,
    };
  }
  if (params.price_lte != undefined) {
    query.priceMillionBahtTo = {
      $lte: params.price_lte,
    };
  }

  return query;
}