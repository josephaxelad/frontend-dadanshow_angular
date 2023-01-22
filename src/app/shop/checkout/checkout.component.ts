import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { UserDeliveries } from 'src/app/models/user-deliveries';
import { Users } from 'src/app/models/users';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  userCart : Cart[];
  userCartData ;
  displayName : string;
  currentUser: Users;
  currentUserDeliveryAddress : UserDeliveries;
  public currentUserObs: Observable<Users>;
  cartObs: Observable<Cart[] >;
  cartDataObs: Observable<any>;
  userCartObs: Observable<Cart[] >;
  userCartDataObs: Observable<any>;


  constructor(private checkoutservice : CheckoutService, private ordersService : OrdersService, private userService : UsersService,private cartService : CartService) {

  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.cartService.initUserCart();
    this.cartService.initCart();

    //Récuperer l'email de l'utilisateur actuel
    this.currentUserObs = this.userService.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.userService.logout();
      }
    });

    // Récuperer les paniers
    this.userCartObs = this.cartService.cartUserSubject.asObservable();
    this.userCartObs.subscribe(userCart =>{this.userCart= userCart ;});

    this.userCartDataObs = this.cartService.cartUserDataSubject.asObservable();
    this.userCartDataObs.subscribe(userCartData =>{this.userCartData= userCartData ;});


    this.currentUserDeliveryAddress = this.userService.currentUserDeliveryAddress;


  }

  // createOrder(){
  //   const user = this.userService.currentUser;
  //
  //   const cart = this.userCart;
  //   const totalPrice = this.userCartData.cost;

  //   this.ordersService.createOrders(user,cart,totalPrice,0)
  //   .then(
  //     ()=>{
  //
  //   })
  //   .catch(
  //     (error) => {
  //
  //     }
  //   )
  // }

}
