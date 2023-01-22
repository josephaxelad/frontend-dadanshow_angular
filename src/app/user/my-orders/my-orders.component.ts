import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/models/products';
import { UserOrders } from 'src/app/models/user-orders';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit,OnDestroy {

  userOrders : UserOrders[] = [];
  userOrdersSub : Subscription;

  constructor(private userService : UsersService) { }

  ngOnInit(): void {
    this.userOrders = this.userService.userOrders;
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

}
