import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../models/products';
import { Response } from '../models/response';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products : Products[] = [];
  prod : Subscription;
  productSub= new Subject<Products[]>();
  numberOfProductsByPage =20;
  productsByPage : Products[] = [];
  pages: number[] = [];

  constructor(private http : HttpClient) {
    //this.getNumberOfPages();
    //this.getPages();
    this.getProductsFromServer();
    //this.emitProducts();

  }

  emitProducts(){
    this.productSub.next(this.products);
  }

  getProductsFromServer() : void {
    const url = `${environment.api+'getProducts.php?API_KEY='+environment.api_key}`;
    this.http.get(url).subscribe(
      (dataProducts : Response)=>{
        if(dataProducts.status == 200){
          this.products = dataProducts.result;
          this.emitProducts();
        }else{
        }
      }
    );

  }
  getNumberOfPages():number{
    const numberOfPage = Math.ceil(this.products.length/this.numberOfProductsByPage);
    return numberOfPage;
  }

  getPages() : number[]{
    const numberOfPage = this.getNumberOfPages();
    for (let i = 0; i < numberOfPage; i++) {
      this.pages[i]=i;
    }
    return this.pages;
  }

  getProductByPage(numberPage: number): Products[]{
    /*const numberOfPage = this.products.length/this.numberOfProductsByPage;
    for (let i = 0; i < numberOfPage; i++) {
      this.pages[i]=i;
    }*/
    const numberOfPage = this.getNumberOfPages();
    if (numberPage >= 0 && numberPage < numberOfPage) {
      const productsByPage = this.products.slice((numberPage*this.numberOfProductsByPage),(numberPage+1)*this.numberOfProductsByPage);
      return productsByPage;
    } else {

      return null;
    }


  }

  getProductById(id : number) : Products {
    const product = this.products.find(element => element.idProduct == id);
    if (product) {
      return product;
    } else {
    }
  }

}
