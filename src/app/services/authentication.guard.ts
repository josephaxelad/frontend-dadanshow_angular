import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from '../models/users';
import { CartService } from './cart.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  currentUser: Users;
  public currentUserObs: Observable<Users>;

  constructor(private router : Router,private userService : UsersService){
    //Récuperer l'email de l'utilisateur actuel
    this.currentUserObs = this.userService.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.userService.logout();
      }
    });


  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

        //Récuperer l'email de l'utilisateur actuel
        this.currentUserObs = this.userService.currentUserSubject.asObservable();
        this.currentUserObs.subscribe(user =>{
          this.currentUser= user;
          if (!user) {
            this.currentUser=null;
            this.userService.logout();
          }
        });
    return new Promise(
      (resolve,reject)=>{
        const currentUser = this.currentUser;
          if (currentUser) {
            resolve(true);
          } else {
            this.router.navigate(["/login"]);
            reject(false);
          }
        }
    );
  }

}
