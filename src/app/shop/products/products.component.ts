import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products : Products[] = [];
  prefUrlImage = `${environment.prefUrlImage}`;
  prodSub: Subscription;
  currentPage = 0;
  pages: number[] = [];
  title: string;
  logo: string;
  backgroundImage : string;
  backgroundColor: string;
  id:number;

  constructor(private route : ActivatedRoute,private productsService : ProductsService,private cartService : CartService ) { }

  ngOnInit(): void {

    // this.prodSub = this.productsService.productSub.subscribe(
    //   (data)=>{
    //     this.pages = this.productsService.getPages();
    //     //this.products = this.productsService.products;
    //     this.products=this.productsService.getProductByPage(this.currentPage);
    //     //this.productsService.emitProducts();
    //

    //   }
    // );
    // this.productsService.emitProducts();

    this.route.params.subscribe(
      (req)=>{
        if (+req.id == 1) {
          window.scrollTo(0,0);
          this.id =1;
          this.title = "Secret de Mafa";
          this.logo = "sm_.png";
          this.backgroundImage ="sm.jpeg";
          this.backgroundColor= "rgb(243, 233, 97)";
        } else {
          window.scrollTo(0,0);
          this.id =2;
          this.title = "Maison AyaHelen";
          this.logo = "ah_.png";
          this.backgroundImage ="ah.jpg";
          this.backgroundColor = "rgb(143, 224, 122)";
        };
        this.prodSub = this.productsService.productSub.subscribe(
          (data : Products[])=>{
            const prod = data.filter((value) =>{
              return value.Category == +req.id;
            });
            this.products=prod;

          }

        );
        this.productsService.emitProducts();

      }
    );


  }

  ngOnDestroy(): void{
    this.prodSub.unsubscribe();
  }

  addToCart(product :Products): void{
    this.cartService.addProductToCart(product);
  }

  deleteFromCart(product :Products): void{
    this.cartService.deleteFromCart(product);
  }

  changePage(numberPage : number) : void{
    const prod = this.productsService.getProductByPage(numberPage);
    if (prod) {
      this.products = prod;
      this.currentPage = numberPage;
    }
  }

  nextPage() : void {
    const newCurrentPage = this.currentPage + 1;
    const prod = this.productsService.getProductByPage(newCurrentPage);
    if (prod) {
      this.products = prod;
      this.currentPage =newCurrentPage;
    }
  }

  prevPage() : void {
    const newCurrentPage = this.currentPage - 1;
    const prod = this.productsService.getProductByPage(newCurrentPage);
    if (prod) {
      this.products = prod;
      this.currentPage =newCurrentPage;
    }
  }

}
