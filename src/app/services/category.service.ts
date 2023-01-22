import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] =[];
  categorySub = new Subject<Category[]>();

  constructor(private http: HttpClient) {
    this.getCategoriesFromServer();
  }


  getCategoriesFromServer(): void{
    const url = `${environment.api+'category?API_KEY='+environment.api_key}`;
    this.http.get(url).subscribe(
      (response : Response)=>{
        if (response.status == 200) {
          this.categories=response.result;
          this.emitCategories();
        } else {
        }
      }
    );

  }

  emitCategories() : void{
    this.categorySub.next(this.categories);
  }

}
