import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products } from '../models/products';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

  productsByCategory: Products[] =[] ;
  prodSub: Subscription;
  products:Products[] =[];

  constructor(private route : ActivatedRoute, private productsService : ProductsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (req)=>{
        this.prodSub = this.productsService.productSub.subscribe(
          (data : Products[])=>{
            const prod = data.filter((value) =>{
              return value.Category == +req.id;
            });
            this.productsByCategory=prod;

          }

        );
        this.productsService.emitProducts();

      }
    );
    //this.productsService.emitProducts();
  }

  ngOnDestroy(): void{
    this.prodSub.unsubscribe();
  }

}
