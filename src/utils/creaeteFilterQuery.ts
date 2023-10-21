import { FilterQuery } from "mongoose";
import { IRealEstate } from "../models/RealEstate.js";
import { FilterParams } from "../schemas/filter.schema.js";

type Query = FilterQuery<IRealEstate> & {
  _page?: number;
  _limit?: number;
}

export const createFilterQuery = (params: Omit<FilterParams, '_limit' | '_page'>): Query => {
  const query: Query = {};
  // return {
  //   isVilla: params.isVilla,
  //   isApartment: params.isApartment,
  //   location: params.location,
  //   badroomsAmountFrom: {
  //     $gte: params.badroomsAmount_gte,
  //   },
  //   badroomsAmountTo: {
  //     $lte: params.badroomsAmount_lte,
  //   },
  //   builtUpAreaFrom: {
  //     $gte: params.builtUpArea_gte,
  //   },
  //   builtUpAreaTo: {
  //     $lte: params.builtUpArea_lte,
  //   },
  //   landAreaFrom: {
  //     $gte: params.landArea_gte,
  //   },
  //   landAreaTo: {
  //     $lte: params.landArea_lte,
  //   },
  //   priceMillionBahtFrom: {
  //     $gte: params.price_gte,
  //   },
  //   priceMillionBahtTo: {
  //     $lte: params.price_lte,
  //   },
  // }

  if(params.isVilla != undefined) {
    query.isVilla = params.isVilla;
  }
  if(params.isApartment != undefined) {
    query.isApartment = params.isApartment;
  }
  if(params.isPriorityBuilding != undefined) {
    query.isPriorityBuilding = params.isPriorityBuilding;
  }
  if(params.location != undefined) {
    query.location = params.location;
  }
  if(params.badroomsAmount_gte != undefined) {
    query.badroomsAmountFrom = {
      $gte: params.badroomsAmount_gte,
    };
  }
  if(params.badroomsAmount_lte != undefined) {
    query.badroomsAmountTo = {
      $lte: params.badroomsAmount_lte,
    };
  }
  if(params.builtUpArea_gte != undefined) {
    query.builtUpAreaFrom = {
      $gte: params.builtUpArea_gte,
    };
  }
  if(params.builtUpArea_lte != undefined) {
    query.builtUpAreaTo = {
      $lte: params.builtUpArea_lte,
    };
  }
  if(params.landArea_gte != undefined) {
    query.landAreaFrom = {
      $gte: params.landArea_gte,
    };
  }
  if(params.landArea_lte != undefined) {
    query.landAreaTo = {
      $lte: params.landArea_lte,
    };
  }
  if(params.price_gte != undefined) {
    query.priceMillionBahtFrom = {
      $gte: params.price_gte,
    };
  }
  if(params.price_lte != undefined) {
    query.priceMillionBahtTo = {
      $lte: params.price_lte,
    };
  }

  return query;
}