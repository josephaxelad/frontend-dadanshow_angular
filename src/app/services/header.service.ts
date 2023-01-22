import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  cart : Cart[] = [];
  cartData = {len :0,cost :0,};
  userCart : Cart[] = [];
  userCartData = {len :0,cost :0,};
  cartObs: Observable<Cart[] >;
  cartDataObs: Observable<any>;
  userCartObs: Observable<Cart[] >;
  userCartDataObs: Observable<any>;

  constructor(private cartService : CartService) {
    console.log("header.service a démarré")
  }

  updateCart(){
    console.log("ok");

  }
}
