import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';
import { UserDeliveries } from '../models/user-deliveries';
import { UserOrders } from '../models/user-orders';
import { Users } from '../models/users';
import { AlertService } from './alert.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: Users;
  isAuth = false;
  currentUserFirebaseSub= new Subject<any>();
  userSubject:BehaviorSubject<Users> = new BehaviorSubject<Users>({type : 1});
  currentUser =null;
  currentUserFirebase =null;
  userOrders :UserOrders[] = [];
  userOrdersSubject= new Subject<UserOrders[]>();
  userDeliveriesAddress : UserDeliveries[]= [];
  userDeliveriesAddressSubject= new Subject<UserDeliveries[]>();
  currentUserDeliveryAddress : UserDeliveries;
  displayName : string ;


  public currentUserSubject: BehaviorSubject<Users>;
  public currentUserObs: Observable<Users>;

  constructor(private http : HttpClient,private cartService : CartService,private alertService : AlertService) {
    this.getCurrentUser();
    this.getFirebaseCurrentUser();
    this.initCurrentUserDeliveryAddress();
    this.cartService.currentUser=this.currentUser;
    this.cartService.currentUserDeliveryAddress = this.currentUserDeliveryAddress;
    this.getUserOrdersFromServer();
    this.getUserDeliveryAddressFromServer();
    this.getUserByEmail();
    this.isVerifMail();


  }

  getCurrentUser_(){
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUserObs = this.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (user) {
        this.isAuth= true;
      } else {
        this.isAuth= false;
      }
    });
  }

  emitUser(): void{
    this.userSubject.next(this.user);
  }

  authentifier_(newUser: Users){

    return new Promise(
      (resolve,reject)=>{
        const url = `${environment.api +'authentifier.php?API_KEY=' + environment.api_key}` + '&email=' + newUser.email +
        '&password=' +newUser.password;
        this.http.get(url).subscribe(
          (data : Response)=>{
            if(data.status == 200){
              const user = {
                email: data.result.email,
                firstname: data.result.firstname,
                lastname: data.result.lastname,
              } ;
              if (typeof(localStorage) !== "undefined") {
                localStorage.setItem('currentUser', JSON.stringify(user));
              }
              this.currentUser = user;
              this.isAuth = true;
              this.emitUser();
              resolve(data.result);
            } else {
              reject(data.message);
            }
          },
          (error)=>{
            reject(false);
          }
        );
      }
    );

  }

  createUser_(newUser : Users){
    return new Promise(
      (resolve,reject)=>{
        const url = `${environment.api + 'createUsers.php?API_KEY=' + environment.api_key}` +'&email=' +newUser.email +'&password=' + newUser.password
        +'&firstname=' + newUser.firstname +'&lastname=' + newUser.lastname+ '&type='+ newUser.type ;

        this.http.get(url).subscribe(
          (data : Response)=>{
            if (data.status == 200) {
              // this.user= data.args;
              // this.isAuth = true;
              // this.authentifier(newUser);
              // this.emitUser();
              resolve(data.result);
            } else {
              reject(data.message);

            }
          }
        )
      }
    )
  }

  logout_(){

    localStorage.removeItem('currentUser');
    this.isAuth=false;
    this.currentUser=null;
    this.currentUserSubject.next(null);
    //this.user= null;
    //this.userSubject = new Subject<Users>();
    //this.emitUser();
  }

  ////////////////////////////////////////FIREBASE///////////////////////////////////////////////////////

  emitCurrentUserFirebase(){
    this.currentUserFirebaseSub.next(this.currentUserFirebaseSub);
  }

  createUser(newUser : Users)  {
    return new Promise(
      (resolve, reject) => {
        firebase.default.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(
          (userCredential) => {
            // Signed in
            // const user = userCredential.user;
            // ...
            this.authentifier(newUser);
            const displayName = `${newUser.firstname} ${newUser.lastname}`;
            this.updateUserFirebase(displayName);
            this.createUser_(newUser);
            // this.sendVerifyMail();
            resolve('Compte créé avec succes');
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  updateUserFirebase(displayName){
    return new Promise(
      (resolve,reject)=>{
        firebase.default.auth().currentUser.updateProfile({
          displayName: displayName,
        }).then(function() {
          // Update successful.
          resolve(true);
        }).catch(function(error) {
          // An error happened.
          reject(error);
        });

      });
  }

  authentifier(user : Users) {
    return new Promise(
      (resolve, reject) => {
        firebase.default.auth().signInWithEmailAndPassword(user.email, user.password).then(
          (data) => {
            if (typeof(localStorage) !== "undefined") {
              localStorage.setItem('currentUser', JSON.stringify(data.user.email));
            }
            this.currentUser = data.user.email;
            this.currentUserFirebase= data.user;
            this.displayName = data.user.displayName;
            this.getUserOrdersFromServer();
            this.cartService.currentUser=data.user.email;
            this.getCurrentUser();
            this.emitUser();
            // this.cartService.emitCarts();
            // this.isVerifMail();
            resolve("vous êtes connecté");
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  logout() {
    if (typeof(localStorage) !== "undefined") {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserDeliveryAddress');
    }
    this.currentUser = null;
    this.cartService.currentUser=null;
    this.currentUserDeliveryAddress=null;
    this.userDeliveriesAddressSubject= new Subject<UserDeliveries[]>();
    this.userSubject= new BehaviorSubject<Users>({type : 1});
    firebase.default.auth().signOut();
  }

  getCurrentUser(){
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUserObs = this.currentUserSubject.asObservable();
    this.currentUserObs.subscribe(user =>{
      this.currentUser= user;
      if (!user) {
        this.currentUser=null;
        this.logout();
      }
    });
  }

  updateCurrentUserPassword(oldUserPassword,newUserPassword){
    const currentUser =this.currentUser;
    return new Promise(
      (resolve, reject) => {
        firebase.default.auth().sendPasswordResetEmail(this.currentUser).then(
          (data)=>{
            firebase.default.auth().onAuthStateChanged(function(user) {
              var user = firebase.default.auth().currentUser;
              if (user) {

                var credential= firebase.default.auth.EmailAuthProvider.credential(currentUser,oldUserPassword);
                user.reauthenticateWithCredential(credential).then(function() {
                  // User re-authenticated.
                  user.updatePassword(newUserPassword).then(function() {
                    // Update successful.
                    resolve(data);
                  }).catch(function(error) {
                    // An error happened.
                    reject(error);
                  });
                }).catch(function(error) {
                  // An error happened.
                  reject(error);
                });
              } else {
                // No user is signed in.
                reject("Pas d'utilisateur connecté");
              }
            });

          },
          (error)=>{
            reject(error);
          }
        )
      }
    )
  }

  getFirebaseCurrentUser(){
    firebase.default.auth().onAuthStateChanged(function(user) {
      var user = firebase.default.auth().currentUser;
      if (user) {
        this.currentUserFirebase=user;
      } else {
        // No user is signed in.
      }
    });
  }

  resetPassword(email : string){
    var emailAddress = email;
    return new Promise((resolve, reject) => {
      firebase.default.auth().sendPasswordResetEmail(emailAddress)
      .then(function() {
        // Email sent.
        resolve(true);
      }).catch(function(error) {
        // An error happened.
        reject(error);
      });
    })

  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getUserOrdersFromServer(){
    const url = `${environment.api+'getOrdersByUser.php?API_KEY='+environment.api_key}`+'&emailUser='+this.currentUser;
    this.http.get(url).subscribe(
      (response : Response)=>{
        if (response.status == 200) {
          this.userOrders= response.result;
          this.emitUserOrders();
        } else {
        }

      },
      (error)=>{
      }
    )
  }

  emitUserOrders(): void{
    this.userOrdersSubject.next(this.userOrders);
  }

  emitUserDeliveryAddress(): void{
    this.userDeliveriesAddressSubject.next(this.userDeliveriesAddress);
  }

  addNewDeliveryAddress(deliveryAddress_ : UserDeliveries){
    this.userDeliveriesAddress.push(deliveryAddress_);
    const deliveriesAddress = this.userDeliveriesAddress;
    return new Promise ((resolve, reject) => {
      this.updateUserDeliveriesAddressInServer(deliveriesAddress)
      .then(()=>{
        resolve(true);
      })
      .catch((error)=>{
        reject(error);
      })
    })

  }

  getUserDeliveryAddressFromServer(){
    this.getCurrentUser();
    const url = `${environment.api+'getUserDeliveriesAddress.php?API_KEY='+environment.api_key}`+'&emailUser='+this.currentUser;
    this.http.get(url).subscribe(
      (response : Response)=>{
        if (response.status == 200) {
          this.userDeliveriesAddress= response.result;
          this.emitUserDeliveryAddress();
        }else{
          this.userDeliveriesAddress= [];
          this.emitUserDeliveryAddress();
        }
      },
      (error)=>{
        this.userDeliveriesAddress=  [];
        this.emitUserDeliveryAddress();
      }
    );
    console.log(this.userDeliveriesAddress);
  }

  updateDeliveryAddressInServer(userDelivery : UserDeliveries,newUserDelivery : UserDeliveries){
    const indexUserDelivery = this.userDeliveriesAddress.findIndex(x => x===userDelivery);
    this.userDeliveriesAddress.splice(indexUserDelivery,1,newUserDelivery);
    const deliveriesAddress = this.userDeliveriesAddress;
    return new Promise ((resolve, reject) => {
      this.updateUserDeliveriesAddressInServer(deliveriesAddress)
      .then(()=>{
        resolve(true);
      })
      .catch((error)=>{
        reject(error);
      })
    })
  }

  deleteDeliveryAddressToServer(userDelivery : UserDeliveries){
    const indexUserDelivery = this.userDeliveriesAddress.findIndex(x => x===userDelivery);
    this.userDeliveriesAddress.splice(indexUserDelivery,1);
    const deliveriesAddress = this.userDeliveriesAddress;
    return new Promise ((resolve, reject) => {
      this.updateUserDeliveriesAddressInServer(deliveriesAddress)
      .then(()=>{
        resolve(true);
      })
      .catch((error)=>{
        reject(error);
      })
    })
  }

  updateUserDeliveriesAddressInServer(deliveriesAddress_ : UserDeliveries[]){
    const deliveriesAddress : string = JSON.stringify(deliveriesAddress_);
    const email : string = this.currentUser;
    const url = `${environment.api + "updateUserDeliveriesAddress.php?API_KEY=" + environment.api_key}`+'&email='+ email +'&deliveryAddress='+ deliveriesAddress;

    return new Promise(
      (resolve, reject) => {
        this.http.get(url).subscribe(
          (response : Response)=>{
            if (response.status == 200) {
              resolve(true);
              this.getUserDeliveryAddressFromServer();
            } else {
              reject(response.message);
            }
          },
          (error)=>{
            reject(error);
          }
        )
      }
    );
  }

  updateCurrentUserDeliveryAddress(userDeliveryAddress : UserDeliveries){
    this.currentUserDeliveryAddress = userDeliveryAddress;
    this.cartService.currentUserDeliveryAddress =this.currentUserDeliveryAddress;
    //Tester si localstorage est compatible avec le navigateur avant de stocker les données si oui
    if (typeof(localStorage) !== "undefined") {
      localStorage.setItem('currentUserDeliveryAddress', JSON.stringify(userDeliveryAddress));
    }
    this.initCurrentUserDeliveryAddress();
    this.cartService.updateUserDataCart();

  }

  initCurrentUserDeliveryAddress(): void{
    if (typeof(localStorage) !== 'undefined') {
      const currentUserDeliveryAddress = JSON.parse(localStorage.getItem('currentUserDeliveryAddress'));
      this.currentUserDeliveryAddress = currentUserDeliveryAddress ? currentUserDeliveryAddress : null;
      this.cartService.currentUserDeliveryAddress =this.currentUserDeliveryAddress;
    }
  }

  getUserByEmail(){
    const url = `${environment.api+'getUserByEmail.php?API_KEY='+environment.api_key}`+'&emailUser='+this.currentUser;
    this.http.get(url).subscribe(
      (response : Response)=>{
        if (response.status == 200) {
          this.user= response.result;
          this.emitUser();
        } else {
        }

      },
      (error)=>{
      },
    );
  }

  updateUser(user : Users){
    const email = user.email;
    const firstname = user.firstname;
    const lastname = user.lastname;
    const url = `${environment.api + "updateUsers.php?API_KEY=" + environment.api_key}`+'&email='+ email +'&lastname='+ lastname +'&firstname='+ firstname;
    this.http.get(url).subscribe(
      (response : Response)=>{
        if (response.status == 200) {
        } else {
        }

      },
      (error)=>{
      }
    );

  }

  sendVerifyMail(){
    var user = firebase.default.auth().currentUser;
    user.sendEmailVerification().then(function() {
      // Email sent.

    }).catch(function(error) {
      // An error happened.
    });
  }

  isVerifMail(){
    var user = firebase.default.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;

    }else{
    }
  }

  signInWithGoogle(){
    return new Promise((resolve, reject) => {
      var provider = new firebase.default.auth.GoogleAuthProvider();
    firebase.default.auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user.email;

      if (typeof(localStorage) !== "undefined") {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.getCurrentUser();
      this.getUserOrdersFromServer();
      this.currentUser = user;
      this.currentUserFirebase= result.user;
      this.displayName = result.user.displayName;
      this.cartService.currentUser=user;
      const newUser: Users = {
        firstname: result.user.displayName,
        lastname : result.user.displayName,
        email : user,
        password : 'ras',
        type: 2
        }
      this.createUser_(newUser);
      this.getUserByEmail();
      // this.isVerifMail();




      resolve(true);
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      reject(error);
      // ...
    });
    })

  }

}

