import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { Cart } from 'src/app/models/cart';
import { Users } from 'src/app/models/users';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  errorMessage;
  isShow=false;
  typePass="password"
  userCart : Cart[] = this.cartService.userCart;

  constructor(
    private usersService : UsersService,
    private fb: FormBuilder,
    private router : Router,
    private cartService: CartService,
    private alertService : AlertService,
    ) {
      this.cartService.initCart();
      this.cartService.initUserCart();
     }

  ngOnInit(): void {
    this.initFormLogin();
    this.isShow=false;

    // Récuperer les panier
    this.cartService.cartUserSubject.subscribe((userCart)=>{this.userCart=userCart});
  }

  initFormLogin(): void{
    this.loginForm= this.fb.group({
      email: this.fb.control('',[Validators.email,Validators.required]),
      password: this.fb.control('',[Validators.minLength(6),Validators.required]),
    });
  }

  onSubmit() : void{
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    const newUser : Users = {email: email , password: password};
    this.usersService.authentifier(newUser)
    .then(
      (data)=>{
        this.usersService.getCurrentUser();
        this.cartService.initCart();
        this.cartService.initUserCart();
        this.usersService.getUserDeliveryAddressFromServer();
        this.usersService.emitUserDeliveryAddress();
        // const userCart = this.cartService.userCart;
        if (this.userCart.length) {
          this.usersService.getUserDeliveryAddressFromServer();
          this.router.navigate(['/delivery']);
        } else {
          this.router.navigate(['/home']);
        }
        this.alertService.alert('Vous êtes connecté!',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });

      }
    )
    .catch(
      (error)=>{
        this.errorMessage="Email ou mot de passe saisis incorrects, veuillez reéssayer svp!"
        // this.alertService.clear('default-alert');
        // this.alertService.error('Email ou mot de passe saisis incorrects, veuillez reéssayer svp!',
        // {
        //   id: 'login',
        //   autoClose: true,
        //   keepAfterRouteChange: false,
        // });
      }

    );
  }

  changeShow(){
    if (this.isShow) {
      this.isShow=false;
      this.typePass="password"
    } else {
      this.isShow=true;
      this.typePass="text"

    }
  }

  submitGoogle(){
    this.usersService.signInWithGoogle()
    .then((data)=>{
        this.usersService.getCurrentUser();
        this.cartService.initCart();
        this.cartService.initUserCart();
        this.usersService.getUserDeliveryAddressFromServer();
        this.usersService.emitUserDeliveryAddress();
        console.log(this.userCart);
        // const userCart = this.cartService.userCart;
        if (this.userCart.length) {
          this.usersService.getUserDeliveryAddressFromServer();
          this.router.navigate(['/delivery']);
        } else {
          this.router.navigate(['/home']);
        }
        this.alertService.alert('Vous êtes connecté!',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
    })
    .catch((error)=>{
      console.log(error)
    })
  }

}
