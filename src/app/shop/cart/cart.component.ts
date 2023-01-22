import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Products } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { HeaderService } from 'src/app/services/header.service';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart : Cart[] = [];
  cartData = {len :0,cost :0,};
  userCart : Cart[] = [];
  userCartData = {len :0,cost :0,};
  prefUrlImage = `${environment.prefUrlImage}`;
  products = [];

  constructor(private cartService : CartService,private productsService : ProductsService) {
    this.cartService.initCart();
    this.cartService.initUserCart();
  }

  ngOnInit(): void {
    window.scrollTo(0,0);

    // Récuperer les panier
    this.cartService.cartSubject.subscribe((cart)=>{this.cart=cart});
    this.cartService.cartDataSubject.subscribe((cartData)=>{this.cartData=cartData});
    this.cartService.cartUserSubject.subscribe((userCart)=>{this.userCart=userCart});
    this.cartService.cartUserDataSubject.subscribe((userCartData)=>{this.userCartData=userCartData});

    this.productsService.productSub.subscribe(
      (data : Products[])=>{
        this.products =data;
      }
    );

    this.productsService.emitProducts();
  }

  addToCart(product :Products): void{
    this.cartService.addProductToCart(product);
  }

  deleteFromCart(product :Products): void{
    this.cartService.deleteFromCart(product);
  }

  removeElementOfCart(index : number,productToRemoveOfCart : Products){
    this.cartService.removeElementOfCart(index,productToRemoveOfCart);
  }

  removeAllElementOfCart(){
    this.cartService.removeAllElementOfCart();
  }
}

