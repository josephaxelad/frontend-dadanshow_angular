import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { Users } from '../models/users';
import { CartService } from './cart.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryGuard implements CanActivate {

  currentUser: Users;
  public currentUserObs: Observable<Users>;
  cart : Cart[] = [];
  cartData = {len :0,cost :0,};
  userCart : Cart[] = [];
  userCartData = {len :0,cost :0,};

  constructor(private router : Router, private cartService : CartService,private userService : UsersService){
    this.cartService.initCart();
    this.cartService.initUserCart();


    //Récuperer l'email de l'utilisateur actuel
    this.currentUserObs = this.userService.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.userService.logout();
      }
    });

    // Récuperer les panier
    this.cartService.cartSubject.subscribe((cart)=>{this.cart=cart});
    this.cartService.cartDataSubject.subscribe((cartData)=>{this.cartData=cartData});
    this.cartService.cartUserSubject.subscribe((userCart)=>{this.userCart=userCart});
    this.cartService.cartUserDataSubject.subscribe((userCartData)=>{this.userCartData=userCartData});



  }

  canActivate(): Observable<boolean>  | Promise<boolean> |  boolean  {
    this.cartService.initCart();
    this.cartService.initUserCart();


    //Récuperer l'email de l'utilisateur actuel
    this.currentUserObs = this.userService.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.userService.logout();
      }
    });
        // Récuperer les panier
        this.cartService.cartSubject.subscribe((cart)=>{this.cart=cart});
        this.cartService.cartDataSubject.subscribe((cartData)=>{this.cartData=cartData});
        this.cartService.cartUserSubject.subscribe((userCart)=>{this.userCart=userCart});
        this.cartService.cartUserDataSubject.subscribe((userCartData)=>{this.userCartData=userCartData});

    return new Promise(
      (resolve,reject)=>{
        const currentUser = this.currentUser;
        const cart = this.cart;
        const userCart = this.userCart;

        if (cart.length || userCart.length) {
          if (userCart.length) {
            if (currentUser) {
              resolve(true);
            } else {
              this.router.navigate(["/login"]);
              reject(false);
            }
          } else {
            if (cart.length) {
              this.router.navigate(["/login"]);
            reject(false);
            } else {
              this.router.navigate(["/home"]);
              reject(false);
            }
          }
        }else{
          this.router.navigate(["/home"]);
          reject(false);
        }

      }
    );
  }

}
