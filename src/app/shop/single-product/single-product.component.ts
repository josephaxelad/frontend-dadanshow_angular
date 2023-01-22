import { ViewportScroller } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {

  product : Products;
  products : Products[] = [];
  prefUrlImage = `${environment.prefUrlImage}`;
  prodSub: Subscription;
  //id: number = 0;
  constructor(private route : ActivatedRoute, private productService : ProductsService,private cartService : CartService, private viewportScroller: ViewportScroller) {
    //viewportScroller.scrollToPosition([0,0]);

  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    const id = +this.route.snapshot.params["id"];
    this.prodSub = this.productService.productSub.subscribe(
      (data)=>{
        this.product = this.productService.getProductById(id);
      }
    );
    this.productService.emitProducts();




  }

  addToCart(product :Products): void{
    this.cartService.addProductToCart(product);
  }

  getProductById(id : number) : Products {
    const product = this.products.find(element => element.idProduct == id);
    if (product) {
      return product;
    } else {
    }

  }



}
