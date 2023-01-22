import { UserDeliveries } from "./user-deliveries";

export interface UserOrders {
  idOrder? : number;
  emailUser? : string;
  cmdLine? ;
  createDat?;
  deliveryPrice?: number;
  price?: number;
  state?: number;
  delivery? : UserDeliveries;

}
