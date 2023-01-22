import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { CartService } from './cart.service';
import { OrdersService } from './orders.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  userCart : Cart[];
  userCartData ;
  constructor() {

  }


}
