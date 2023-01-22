import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { Users } from '../models/users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  isAuth = false;

  currentUser: Users;


  constructor( private usersService : UsersService, private router : Router) {

  }

  ngOnInit(): void {
    //this.isAuth=this.usersService.isAuth;
    firebase.default.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
    this.currentUser =this.usersService.currentUser;
  }

  logout(isAuthValue){
    //this.isAuth=isAuthValue;
    //this.usersService.logout();
    //this.usersService.emitUser();
    //this.router.navigate(['']);
  }

  ngOnDestroy() : void{
    // unsubscribe to ensure no memory leaks
    //this.currentUserSubscription.unsubscribe();
 }

}
