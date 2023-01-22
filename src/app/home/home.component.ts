import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../models/products';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';

import { Router, NavigationEnd } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products : Products[] = [];
  productsSM : Products[] = [];
  productsAH : Products[] = [];
  newProducts : Products[] = [];
  prodSub: Subscription;
  prefUrlImage = `${environment.prefUrlImage}`;
  constructor(private productsService : ProductsService,private cartService : CartService,private router: Router, private wowService: NgwWowService) {

  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  // ).subscribe(event => {
  //   // Reload WoW animations when done navigating to page,
  //   // but you are free to call it whenever/wherever you like
  //   this.wowService.init();
  // });

    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
    //   // Reload WoW animations when done navigating to page,
    //   // but you are free to call it whenever/wherever you like
    //   this.wowService.init();
    // });
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.prodSub = this.productsService.productSub.subscribe(
      (data)=>{
        //this.pages = this.productsService.getPages();
        this.products = data;
        this.productsSM = data.filter(prod => prod.Category==1);
        this.productsAH = data.filter(prod => prod.Category==2);
        //this.products=this.productsService.getProductByPage(this.currentPage);
        //this.productsService.emitProducts();
      }
    );
    this.productsService.emitProducts();
  }

  addToCart(product :Products): void{
    this.cartService.addProductToCart(product);
  }

}
