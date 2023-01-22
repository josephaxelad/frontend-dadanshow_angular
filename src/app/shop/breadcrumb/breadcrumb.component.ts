import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() step : number;
  cartState='';
  deliveryState='';
  deliveryDisabled=true;
  checkoutState='';
  checkoutDisabled=true;
  cart;
  userCart;

  constructor(private cartService : CartService) {
    this.cart =this.cartService.cart;
    this.userCart =this.cartService.userCart;
  }

  ngOnInit(): void {
    switch (this.step) {
      case 1:
        this.cartState='active';
        this.deliveryState='';
        this.checkoutState='';
        if (this.cart.length || this.userCart.length) {
          // this.deliveryDisabled=false;
        }
        break;
      case 2:
        if (this.cart.length || this.userCart.length ) {
          this.cartState='completed';
        } else {
          this.cartState='';
        };
        this.deliveryState='active';
        this.checkoutState='';
        break;
      case 3:
        if (this.cart.length || this.userCart.length ) {
          this.cartState='completed';
        } else {
          this.cartState='';
        };
        this.deliveryDisabled=false;
        this.deliveryState='completed';
        this.checkoutState='active';
        break;
      default:
        break;
    }
  }

}
