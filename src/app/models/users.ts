import { Cart } from "./cart";

export interface Users {
  idUser?: number;
  sexe?: number;
  pseudo?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  dateBirth?: string;
  cart?: Cart[];
  cartData? ;
  type? : number;
}
