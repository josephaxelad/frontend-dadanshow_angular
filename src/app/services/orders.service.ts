import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Response } from '../models/response';
import { UserDeliveries } from '../models/user-deliveries';
import { Users } from '../models/users';
import { AlertService } from './alert.service';
import { CartService } from './cart.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient,private cartService: CartService,private usersService : UsersService,private router : Router,private datepipe: DatePipe,private alertService : AlertService) { }


  createOrders(user: Users,cart : Cart[],totalPrice ,deliveryPrice,delivery_ : UserDeliveries ){

    return new Promise(
      (resolve,reject)=>{
        const cmdLine_ = [];
        cart.forEach(item => cmdLine_.push( {'product' : {
          'id' : item.product.idProduct,
          'name' :item.product.name,
          'image' :item.product.image,
          'price' :item.product.price,}
          , 'qte' : item.number}) );
        const cmdLine = JSON.stringify(cmdLine_);
        const delivery = JSON.stringify(delivery_);
        const date = this.datepipe.transform(Date(),'y-MM-dd HH:mm:ss');
        const url = `${environment.api +"createOrders.php?API_KEY="+environment.api_key}`+'&price=' +totalPrice+ '&createDate=' +date+ '&cmdLine=' +cmdLine+ '&deliveryPrice=' +deliveryPrice+ '&state=' +1+ '&emailUser='+user+'&delivery='+delivery;
        this.http.get(url).subscribe(
          (response : Response)=>{
            if (response.status == 200) {
              // cart.forEach( item => {this.cartService.removeElementOfCart(0,null);});
              this.cartService.removeAllElementOfCart();
              this.usersService.getUserOrdersFromServer();
              resolve(true);
              // this.router.navigate(['/home']);
              // this.alertService.alert('Commande effectuée avec succès!',
              // {
              //   autoClose: true,
              //   keepAfterRouteChange: true,
              // });
            } else {
              reject(response.message);
              // this.router.navigate(['/home']);
              // this.alertService.alert('Erreur commande non effectuée',
              // {
              //   autoClose: true,
              //   keepAfterRouteChange: true,
              // });
            }

          },
          (error)=>{
            reject( error);
          }
        )

      }
    )
  }
}



















// createOrders_(user: Users,cart : Cart[]){
//   return new Promise(
//     (resolve,reject)=>{
//       cart.forEach((data=>{
//         const price = data.number * data.product.price;
//         const url = `${environment.api + "createOrders.php?API_KEY="+environment.api_key}`+'&idUser=' + user.idUser + '&idProduct=' + data.product.idProduct + '&quantity=' +data.number+'&price='+price;

//         this.http.get(url).subscribe(
//           (response : Response)=>{
//             if(response.status == 200){
//               this.cartService.removeElementOfCart(0,null);
//               if(cart.length == 0){
//                 resolve(true);
//               }
//             } else {
//               reject(response.message);
//             }
//           },
//           (error)=>{
//             reject( error);
//           }
//         )
//       }));//End Foreach
//     }
//   )
// }
