import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserOrders } from 'src/app/models/user-orders';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-order-details',
  templateUrl: './modal-order-details.component.html',
  styleUrls: ['./modal-order-details.component.css']
})
export class ModalOrderDetailsComponent implements OnInit, OnDestroy {

  userOrders : UserOrders[] = [];
  userOrdersSub : Subscription;
  currentUser ;
  prefUrlImage = `${environment.prefUrlImage}`;
  constructor(private userService : UsersService) { }

  ngOnInit(): void {
    this.userOrders = this.userService.userOrders;
    this.currentUser= this.userService.currentUser;
    this.userOrdersSub =this.userService.userOrdersSubject.subscribe(
      (response : UserOrders[])=>{
        this.userOrders = response;
      },
      (error)=>{
      }
    );
    this.userService.emitUserOrders();
  }

  ngOnDestroy(): void {
    this.userOrdersSub.unsubscribe();
  }

  getCurrentUserOrderCmdLine(){
    const currentUserOrder = this.userOrders.find(userOrder => userOrder.emailUser==this.currentUser);
    JSON.parse(currentUserOrder.cmdLine);
  }


}
