import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryZone } from '../models/delivery-zone';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesZoneService {

  deliveriesZone : DeliveryZone[] = [];
  deliveriesZoneSubject = new Subject<DeliveryZone[]>();

  constructor(private http : HttpClient) { }

  getDeliveriesZoneFromServer(){
    const url = `${environment.api+'getDeliveriesZone.php?API_KEY='+environment.api_key}`;
    this.http.get(url).subscribe(
      (data : Response)=>{
        if(data.status == 200){
          this.deliveriesZone = data.result;
          this.emitDeliveriesZone();
        }else{
        }
      }
    );
  }

  emitDeliveriesZone(){
    this.deliveriesZoneSubject.next(this.deliveriesZone);
  }


}
