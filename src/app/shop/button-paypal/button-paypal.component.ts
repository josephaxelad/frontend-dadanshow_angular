import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { Cart } from 'src/app/models/cart';
import { UserDeliveries } from 'src/app/models/user-deliveries';
import { Users } from 'src/app/models/users';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-button-paypal',
  templateUrl: './button-paypal.component.html',
  styleUrls: ['./button-paypal.component.css']
})
export class ButtonPaypalComponent implements OnInit {

  @Input() orderTotalPrice;
  @Input() itemTotalPrice;
  @Input() deliveryPrice;
  @Input() userAddress : UserDeliveries;
  @Input() user : Users;
  @Input() cart : Cart[];

  idClientPaypal = `${environment.idClientPaypal}`;
  currencyPaypal = `${environment.currencyPaypal}`;
  paypalConfig : IPayPalConfig;
  userCart : Cart[] = [];
  userCartData ;


  constructor(private ordersService : OrdersService, private userService : UsersService,private cartService: CartService,private router: Router,private alertService : AlertService) { }

  ngOnInit(): void {
    this.initConfig();
  }

  initConfig(): void {

    const itemTotalPrice = this.cartService.userCartData.cost.toFixed(2);
    const currency = this.currencyPaypal;
    const clientId = this.idClientPaypal;
    const deliveryPrice = this.cartService.userCartData.deliveryPrice.toFixed(2);
    const orderTotalPrice = (this.cartService.userCartData.deliveryPrice+this.cartService.userCartData.cost).toFixed(2);
    const userAddress = this.userAddress;
    const user = this.user ;
    const cart = this.cart;
    const delivery = this.userAddress;

    this.userCart=this.cartService.userCart;
    this.userCartData=this.cartService.userCartData;
    const items = [];
    this.userCart.forEach(e => {
      items.push({
        name : e.product.name ,
        quantity : e.number ,
        category: 'PHYSICAL_GOODS',
        unit_amount:{
          currency_code : currency,
          value: e.product.price
        }
      });
    });

    this.paypalConfig = {
        currency: currency,
        clientId: clientId,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: orderTotalPrice,
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: itemTotalPrice
                        },
                        shipping:{
                            currency_code: currency,
                            value: deliveryPrice

                        }
                    }
                },
                shipping :{
                  address : {
                    country_code: userAddress.country.code,
                    address_line_1: userAddress.address,
                    // address_line_2: 'ezfmzf,kz,qfmkze',
                    admin_area_2: userAddress.city,
                    // admin_area_1: 'ergerg',
                    postal_code: userAddress.zip,
                  }
                } ,
                items: items,
            }],
            application_context:{
              brand_name : "DADA N'SHOW",
              landing_page: 'LOGIN',
              shipping_preference:'SET_PROVIDED_ADDRESS',
              payment_method : {payer_selected : 'PAYPAL'}
            }
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'buynow',
            layout: 'horizontal',
            color: 'black',
            shape:'pill',
            size: 'responsive',
            tagline: false,
        },
        onApprove: (data, actions) => {

            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                this.ordersService.createOrders(user,cart,orderTotalPrice,deliveryPrice,delivery)
                .then(()=>{
                  this.router.navigate(['/home']);
                  this.alertService.alert('Commande effectuée avec succès!',
                  {
                    autoClose: true,
                    keepAfterRouteChange: true,
                  });
                })
                .catch((error)=>{
                  console.log(error);
                  this.router.navigate(['/home']);
                  this.alertService.alert('Erreur commande non effectuée',
                  {
                    autoClose: true,
                    keepAfterRouteChange: true,
                  });
                })
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.router.navigate(['/home']);
            this.alertService.alert('Erreur commande non effectuée',
              {
                autoClose: true,
                keepAfterRouteChange: true,
              });
        },
        onError: err => {
            console.log('OnError', err);
            this.router.navigate(['/home']);
            this.alertService.alert('Erreur commande non effectuée OnError',
              {
                autoClose: true,
                keepAfterRouteChange: true,
              });
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        },
    };
  }
}
