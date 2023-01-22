import { Country } from "./country";

export interface UserDeliveries {
  idUserDeliveries? : number;
  address? : string;
  zip? : string;
  phone? : string;
  country? : Country;
  city? : string;
}
