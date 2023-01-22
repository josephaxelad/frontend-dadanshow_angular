import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ShopComponent } from './shop/shop.component';
import { ProductsComponent } from './shop/products/products.component';
import { SingleProductComponent } from './shop/single-product/single-product.component';
import { CartComponent } from './shop/cart/cart.component';

import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

import { HttpClientModule } from "@angular/common/http";
import { ModalAddToCartComponent } from './shop/modal-add-to-cart/modal-add-to-cart.component';
import { ModalQuickViewComponent } from './shop/modal-quick-view/modal-quick-view.component';
import { CategoryComponent } from './category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { AuthGuard } from './services/auth.guard';
import { ButtonPaypalComponent } from './shop/button-paypal/button-paypal.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ModalLogoutComponent } from './auth/modal-logout/modal-logout.component';
import { CartService } from './services/cart.service';
import { UsersService } from './services/users.service';
import { OrdersService } from './services/orders.service';
import { ProductsService } from './services/products.service';
import { CategoryService } from './services/category.service';
import { EditPasswordComponent } from './user/edit-password/edit-password.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { MyOrdersComponent } from './user/my-orders/my-orders.component';
import { ModalOrderDetailsComponent } from './user/modal-order-details/modal-order-details.component';
import { DeliveryComponent } from './shop/delivery/delivery.component';
import { BreadcrumbComponent } from './shop/breadcrumb/breadcrumb.component';
import { DeliveryGuard } from './services/delivery.guard';
import { AlertComponent } from './alert/alert.component';
import { DatePipe } from '@angular/common';
import { MyDeliveriesComponent } from './user/my-deliveries/my-deliveries.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ForgetPasswordComponent } from './user/forget-password/forget-password.component';
import { AuthenticationGuard } from './services/authentication.guard';
import { NgwWowModule } from 'ngx-wow';
import { NgxSpinnerModule } from "ngx-spinner";




export const routes: Routes = [
  {path:'home',component: HomeComponent},
  {path:'shop/:id',component: ShopComponent},
  // {path:'cart',component: CartComponent},
  {path:'single-product/:id',component: SingleProductComponent},
  {path:'category/:id',component: CategoryComponent},
  {path:'contact',component: ContactComponent},
  {path:'checkout',canActivate:[AuthGuard],component: CheckoutComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'edit-user',canActivate:[AuthenticationGuard],component: EditUserComponent},
  {path:'edit-password',canActivate:[AuthenticationGuard],component: EditPasswordComponent},
  {path:'my-orders',canActivate:[AuthenticationGuard],component: MyOrdersComponent},
  {path:'my-deliveries',canActivate:[AuthenticationGuard],component: MyDeliveriesComponent},
  {path:'forget-Password',component: ForgetPasswordComponent},
  {path:'delivery',canActivate:[DeliveryGuard],component: DeliveryComponent},
  {path:'not-found',component: NotFoundComponent},
  {path:'',component: HomeComponent},
  {path: '**', pathMatch:'full', redirectTo:'not-found'},
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    ShopComponent,
    ProductsComponent,
    SingleProductComponent,
    CartComponent,
    NotFoundComponent,
    ModalAddToCartComponent,
    ModalQuickViewComponent,
    CategoryComponent,
    CheckoutComponent,
    ButtonPaypalComponent,
    SidenavComponent,
    ModalLogoutComponent,
    EditPasswordComponent,
    EditUserComponent,
    MyOrdersComponent,
    ModalOrderDetailsComponent,
    DeliveryComponent,
    BreadcrumbComponent,
    AlertComponent,
    MyDeliveriesComponent,
    ForgetPasswordComponent,


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatRadioModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    NoopAnimationsModule,
    NgwWowModule,
    NgxSpinnerModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CartService,
    UsersService,
    OrdersService,
    ProductsService,
    CategoryService,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
