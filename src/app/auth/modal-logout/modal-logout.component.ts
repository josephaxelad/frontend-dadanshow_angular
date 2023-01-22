import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-modal-logout',
  templateUrl: './modal-logout.component.html',
  styleUrls: ['./modal-logout.component.css']
})
export class ModalLogoutComponent implements OnInit {

  @Output() isAuth = new EventEmitter<boolean>();

  constructor(private usersService : UsersService, private cartService : CartService, private router : Router,private alertService : AlertService ) { }

  ngOnInit(): void {
  }

  logout(){
    this.usersService.logout();
    this.alertService.alert('Vous êtes déconnecté!',{autoClose: true,keepAfterRouteChange: true,});
    this.cartService.logout();
    this.router.navigate(['/home']);
  }

}
