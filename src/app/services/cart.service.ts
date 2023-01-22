import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Products } from '../models/products';
import { Response } from '../models/response';
import { UserDeliveries } from '../models/user-deliveries';
import { Users } from '../models/users';
import { CheckoutService } from './checkout.service';
import { HeaderService } from './header.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public userCart:Cart[]=[];
  public cart: Cart[] = [];
  userCartData = {len: 0,cost: 0,weight: 0,deliveryPrice:0};
  cartData = {len: 0,cost: 0,weight: 0,deliveryPrice:0};
  currentUserDeliveryAddress : UserDeliveries = null;
  currentUser;
  isAuth = false;
  cartSubject: BehaviorSubject<Cart[]> =new BehaviorSubject<Cart[]>([]);
  cartDataSubject: BehaviorSubject<any> =new BehaviorSubject<any>({len: 0,cost: 0,weight: 0,deliveryPrice:0});;
  cartUserSubject: BehaviorSubject<Cart[]> =new BehaviorSubject<Cart[]>([]);;
  cartUserDataSubject: BehaviorSubject<any>= new BehaviorSubject<any>({len: 0,cost: 0,weight: 0,deliveryPrice:0});;

  constructor(private http: HttpClient) {
    this.initCart();
    this.initUserCart();
  }

  addProductToCart(productToAdd : Products): void{
    if (this.currentUser) {
      this.addProductToUserCart(productToAdd);
      console.log(this.userCart);
    } else {
      const a = this.cart;
      console.log(a);
      const checkedProduct = this.cart.find(element => element.product.idProduct == productToAdd.idProduct);
      console.log(checkedProduct);
      if (checkedProduct) {
        checkedProduct.number++;
      } else {
        const newProductToAdd ={
          number: 1,
          product: productToAdd,
        };
        this.cart.push(newProductToAdd);
      }
      this.updateDataCart();
    }
    this.emitCarts();

  }

  deleteFromCart(productToDelete : Products): void{
    if (this.currentUser) {
      this.deleteFromUserCart(productToDelete);
    } else {
      const indexProduct = this.cart.findIndex(element => element.product == productToDelete);
      if (indexProduct !== -1) {
        if (this.cart[indexProduct].number>1) {
          this.cart[indexProduct].number--;
        } else {
          if(this.cart[indexProduct].number==1){
            this.cart.splice(indexProduct,1);
          }
        }
        this.updateDataCart();
      }
    }
    this.emitCarts();
  }

  removeElementOfCart(index : number,productToRemoveOfCart : Products){
    if (this.currentUser) {
      this.removeElementOfUserCart(index,productToRemoveOfCart);
    }else{
      if (index==null) {
        const indexProduct = this.cart.findIndex(element => element.product == productToRemoveOfCart);
        this.cart.splice(indexProduct,1);
        this.updateDataCart();
      } else {
        this.cart.splice(index,1);
        this.updateDataCart();
      }
    }
    this.emitCarts();
  }

  removeAllElementOfCart(){
    if (this.currentUser) {
      this.userCart.forEach( item => {
        //this.removeElementOfUserCart(0,null);
        while (this.userCart.length) {
          this.removeElementOfUserCart(0,null);
        }
      });
    } else {
      this.cart.forEach( item => {
        //this.removeElementOfCart(0,null);
        while (this.cart.length) {
          this.removeElementOfCart(0,null);
        }
      });
    }
    this.emitCarts();
  }

  initCart(): void{
    console.log("initcart");
    if (typeof(localStorage) !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart'));
      const cartData = JSON.parse(localStorage.getItem('cartData'));
      this.cart = cart ? cart : [];
      this.cartData =  cartData ? cartData : {len: 0,cost: 0,weight: 0,deliveryPrice:0};
    } else {
      this.cart = [];
      this.cartData ={len: 0,cost: 0,weight: 0,deliveryPrice:0};
    }
    this.emitCarts();
  }

  updateDataCart(){
    if (!this.currentUser) {
      let len = 0;
      let cost = 0;
      this.cart.forEach(element => {
        len += element.number;
        cost += element.product.price*element.number;
      });
      this.cartData.len= len;
      this.cartData.cost =cost;
      //Tester si localstorage est compatible avec le navigateur avant de stocker les données si oui
      if (typeof(localStorage) !== "undefined") {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('cartData', JSON.stringify(this.cartData));
      }
    }
    this.emitCarts();
  }


        ///////////////////

  addProductToUserCart(productToAdd : Products): void{
    const checkedProduct = this.userCart.find(element => element.product.idProduct == productToAdd.idProduct);
    if (checkedProduct) {
      checkedProduct.number++;
    } else {
      const newProductToAdd ={
        number: 1,
        product: productToAdd,
      };
      this.userCart.push(newProductToAdd);
    }
    this.updateUserDataCart();
    this.emitCarts();
  }

  deleteFromUserCart(productToDelete : Products): void{
    const indexProduct = this.userCart.findIndex(element => element.product == productToDelete);
    if (indexProduct !== -1) {
      if (this.userCart[indexProduct].number>1) {
        this.userCart[indexProduct].number--;
      } else {
        if(this.userCart[indexProduct].number==1){
          this.userCart.splice(indexProduct,1);
        }
      }
      this.updateUserDataCart();
    }
  }

  removeElementOfUserCart(index : number,productToRemoveOfCart : Products){
    if (index==null) {
      const indexProduct = this.userCart.findIndex(element => element.product == productToRemoveOfCart);
      this.userCart.splice(indexProduct,1);
    } else {
      this.userCart.splice(index,1);
    }
    this.updateUserDataCart();
  }

  initUserCart(){
    if (this.currentUser) {
        if(this.cart.length){//si le panier n'est pas vide
          const userCart = JSON.parse(localStorage.getItem(this.currentUser+'Cart'));//sinon recuperer le panier user sauvegardé
          const userCartData = JSON.parse(localStorage.getItem(this.currentUser+'CartData'));//sinon recuperer le panier user sauvegardé
          this.userCart = userCart ? userCart: [];
          this.userCartData = userCartData ? userCartData : {len: 0,cost: 0,weight: 0,deliveryPrice:0};

        this.userCart.concat(this.cart);//recuperer ce panier là
        console.log(this.userCart.concat(this.cart));
        console.log(this.userCart);
        this.userCart=this.userCart.concat(this.cart);
        // this.userCartData=this.cartData;//recuperer ce panier là
        this.updateUserDataCart();//Mise à jour du panier de l'utilisateur
        //rénitialiser cart et cart data
        this.cart = [];
        this.cartData ={len: 0,cost: 0,weight: 0,deliveryPrice:0};
        if (typeof(localStorage) !== 'undefined') {
          localStorage.removeItem('cart');
          localStorage.removeItem('cartData');
        }
      } else {//sinon recuperer le panier user sauvegardé
        if (typeof(localStorage) !== 'undefined') {
          const userCart = JSON.parse(localStorage.getItem(this.currentUser+'Cart'));//sinon recuperer le panier user sauvegardé
          const userCartData = JSON.parse(localStorage.getItem(this.currentUser+'CartData'));//sinon recuperer le panier user sauvegardé
          this.userCart = userCart ? userCart: [];
          this.userCartData = userCartData ? userCartData : {len: 0,cost: 0,weight: 0,deliveryPrice:0};
          this.updateUserDataCart();
        }
      }
    }
    this.emitCarts();
  }

  updateUserDataCart(){
    if (this.userCart) {
      let len = 0;
      let cost = 0;
      let weight = 0;
      this.userCart.forEach(element => {
        len += element.number;
        cost += element.product.price*element.number;
        weight += element.product.weight*element.number;
      });
      this.userCartData.len= len;
      this.userCartData.cost = cost;
      this.userCartData.weight = weight;
      this.getDeliveryPrice(this.currentUserDeliveryAddress,weight);

      //Tester si localstorage est compatible avec le navigateur avant de stocker les données si oui
      if (typeof(localStorage) !== "undefined") {
        localStorage.setItem(this.currentUser+'Cart', JSON.stringify(this.userCart));
        localStorage.setItem(this.currentUser+'CartData', JSON.stringify(this.userCartData));
      }
    }
    this.emitCarts();
  }

  getDeliveryPrice(userDelivery : UserDeliveries,cartWeight): any{
    if (cartWeight>0) {
      if (userDelivery) {
        const idDeliveryZone = userDelivery.country.idDeliveryZone ;
        const url = `${environment.api+'getDeliveryPrice.php?API_KEY='+environment.api_key}`+'&idDeliveryZone='+idDeliveryZone+'&cartWeight='+cartWeight;
        this.http.get(url).subscribe(
          (response : Response)=>{
            if (response.status==200) {
              this.userCartData.deliveryPrice = response.result;
              console.log(this.userCartData.deliveryPrice);
              //Tester si localstorage est compatible avec le navigateur avant de stocker les données si oui
              if (typeof(localStorage) !== "undefined") {
                localStorage.setItem(this.currentUser+'Cart', JSON.stringify(this.userCart));
                localStorage.setItem(this.currentUser+'CartData', JSON.stringify(this.userCartData));
              }
            } else {
              // error
            }
          },
          (error )=>{
            // error
          }
        )
      } else {
        this.userCartData.deliveryPrice = 0;
      }
    } else {
      this.userCartData.deliveryPrice = 0;
    }
  }

  logout(){
    this.userCart = [];
    this.userCartData = {len: 0,cost: 0,weight: 0,deliveryPrice : 0};
    this.cart = [];
    this.cartData = {len: 0,cost: 0,weight: 0,deliveryPrice : 0};
    this.emitCarts();
  }

  emitCarts(){
    this.cartSubject.next(this.cart);
    this.cartDataSubject.next(this.cartData);
    this.cartUserSubject.next(this.userCart);
    this.cartUserDataSubject.next(this.userCartData);
  }



}



// getCarts(){
//   this.cartSubject = new BehaviorSubject<Cart[]>(JSON.parse(localStorage.getItem('Cart')));
//   this.cartDataSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('CartData')));
//   this.cartUserSubject = new BehaviorSubject<Cart[]>(JSON.parse(localStorage.getItem('Cart')));
//   this.cartUserDataSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('CartData')));
// }
// const cartService = {
//   cart : this.cart,
//   cartData : this.cartData,
//   userCart : this.userCart,
//   userCartData : this.userCartData,
//   currentUser : this.currentUser,
//   isAuth : this.isAuth,
// }


// firebase.default.auth().onAuthStateChanged(
    //   (user) => {
    //     if(user) {
    //       this.isAuth = true;
    //       this.currentUser=this.usersService.currentUser;
    //       this.initCart();
    //       this.initUserCart();
    //     } else {
    //       this.isAuth = false;
    //       this.currentUser=null;
    //       this.initCart();
    //       this.initUserCart();
    //     }
    //   }
    // );

    // updateCheckoutData(){
    //   this.checkoutservice.userCart=this.userCart;
    //   this.checkoutservice.userCartData=this.userCartData;
    // }
