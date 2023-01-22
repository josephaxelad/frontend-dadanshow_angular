import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-add-to-cart',
  templateUrl: './modal-add-to-cart.component.html',
  styleUrls: ['./modal-add-to-cart.component.css']
})
export class ModalAddToCartComponent implements OnInit {

  @Input() products: Products[] = [];
  cartData;
  userCartData;
  prefUrlImage = `${environment.prefUrlImage}`;
  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.cartData =this.cartService.cartData;
    this.userCartData =this.cartService.userCartData;
  }

}
