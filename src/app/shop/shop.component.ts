import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Products } from '../models/products';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products : Products[] = [];
  /*
  productss : Products[] = [];
  prodSub: Subscription;
  constructor(private productsService : ProductsService) { }

  ngOnInit(): void {
    this.prodSub = this.productsService.productSub.subscribe(
      (data)=>{
        this.products=data;
      }
    );
    this.productsService.emitProducts();
  }*/
  prodSub: Subscription;
  constructor(private productsService : ProductsService, private cartService : CartService) { }
  ngOnInit(): void {
    this.prodSub = this.productsService.productSub.subscribe(
      (data)=>{
        this.products=data;
      }
    );
    this.productsService.emitProducts();
  }


}
