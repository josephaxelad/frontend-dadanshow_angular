import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Console } from 'node:console';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Category } from '../models/category';
import { Products } from '../models/products';
import { Users } from '../models/users';
import { AlertService } from '../services/alert.service';
import { CartService } from '../services/cart.service';
import { CategoryService } from '../services/category.service';
import { HeaderService } from '../services/header.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() state : string;
  @Input() orderState : number = 0 ;


  logo = `${environment.logo}`;
  prefUrlImage = `${environment.prefUrlImage}`;
  cart : Cart[] = this.cartService.cart;
  cartData = this.cartService.cartData;
  userCart : Cart[] = this.cartService.userCart;
  userCartData = this.cartService.userCartData;
  isAuth = false;
  currentUser: Users;
  currentUserSubscription: Subscription;
  public currentUserObs: Observable<Users>;
  cartSubscription : Subscription;
  cartDataSubscription : Subscription;
  userCartSubscription : Subscription;
  userCartDataSubscription : Subscription;
  user: Users;


  constructor(private cartService : CartService, private categoriesService : CategoryService, private usersService : UsersService, private router : Router,private headerService : HeaderService) {

    // Initialisation : (email de l'utilisateur actuel, cart et usercart)
    this.usersService.getCurrentUser();
    this.cartService.initCart();
    this.cartService.initUserCart();
    this.usersService.getUserByEmail();

  }

  ngOnInit(): void {

    //Mise à jour de isAuth
    firebase.default.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );

    //Récuperer l'email de l'utilisateur actuel
    this.currentUserObs = this.usersService.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.usersService.logout();
      }
    });


    //Récuperer les infos de l'utilisateur actuel
    this.usersService.userSubject.subscribe((user)=>{this.user=user});

    // Récuperer les panier
    this.cartService.cartSubject.subscribe((cart)=>{this.cart=cart});
    this.cartService.cartDataSubject.subscribe((cartData)=>{this.cartData=cartData});
    this.cartService.cartUserSubject.subscribe((userCart)=>{this.userCart=userCart});
    this.cartService.cartUserDataSubject.subscribe((userCartData)=>{this.userCartData=userCartData});


    //Console
    // console.log(this.currentUser);
    // console.log(this.cart);
    // console.log(this.cartData);
    // console.log(this.userCart);
    // console.log(this.userCartData);
    // console.log(this.orderState);
    console.log(this.user);
  }

}



  // cartObs: Observable<Cart[] >;
  // cartDataObs: Observable<any>;
  // userCartObs: Observable<Cart[] >;
  // userCartDataObs: Observable<any>;


// this.cartService.initCart();
// this.cartService.initUserCart();
//     // // Récuperer les paniers
// // this.cartObs = this.cartService.cartSubject.asObservable();
// this.cartService.cartSubject.subscribe(cart =>{this.cart= cart ;});

// // this.cartDataObs = this.cartService.cartDataSubject.asObservable();
// this.cartService.cartDataSubject.subscribe(cartData =>{this.cartData= cartData ;});

// // this.userCartObs = this.cartService.cartUserSubject.asObservable();
// this.cartService.cartUserSubject.subscribe(userCart =>{this.userCart= userCart ;});

// // this.userCartDataObs = this.cartService.cartUserDataSubject.asObservable();
// this.cartService.cartUserDataSubject.subscribe(userCartData =>{this.userCartData= userCartData ;});



// categories : Category[];
// catSub: Subscription;
// user:Users;
// this.catSub = this.categoriesService.categorySub.subscribe(
//   (data : Category[])=>{
//     this.categories=data;
//   }
// )
// this.categoriesService.emitCategories();
// ngOnDestroy() : void{

// }
// logout(){
//   this.usersService.logout();
// }
