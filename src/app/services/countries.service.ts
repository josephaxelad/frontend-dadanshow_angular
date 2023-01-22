import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../models/country';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  countries : Country[] = [];
  countriesSubject = new Subject<Country[]>();

  constructor(private http : HttpClient) {
    this.getCountriesFromServer();
  }

  getCountriesFromServer(){
    const url = `${environment.api+'getCountries.php?API_KEY='+environment.api_key}`;
    this.http.get(url).subscribe(
      (data : Response)=>{
        if(data.status == 200){
          this.countries = data.result;
          this.emitCountries();
        }else{
        }
      }
    );
  }

  emitCountries(){
    this.countriesSubject.next(this.countries);
  }

}
