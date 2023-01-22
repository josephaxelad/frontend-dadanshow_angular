import { Component } from '@angular/core';
import firebase from 'firebase';

import { Router, NavigationEnd } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { filter } from 'rxjs/operators';
import {  Event, NavigationStart, RoutesRecognized,
  RouteConfigLoadStart, RouteConfigLoadEnd,
  NavigationCancel, NavigationError } from '@angular/router';
  import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'initshop';
  isReady = false;
  constructor(private router: Router, private wowService: NgwWowService,private spinner: NgxSpinnerService){

    // this.router.events.pipe(filter(event => event instanceof NavigationStart))
    //   .subscribe(event => {
    //     /** spinner starts on init */
    //     this.spinner.show();
    //   });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        // Reload WoW animations when done navigating to page,
        // but you are free to call it whenever/wherever you like
        // this.spinner.hide();
        this.wowService.init();
      });

  //     router.events.subscribe( (event: Event) =>{
  //     if (event instanceof NavigationStart) {
  //         // Navigation started.
  //        console.log(event.url);
  //        this.spinner.show();
  //     }
  //     else if (event instanceof RoutesRecognized) {
  //         // Router parses the URL and the routes are recognized.
  //     }
  //     else if (event instanceof RouteConfigLoadStart) {
  //        // Before the Router lazyloads a route configuration.
  //     }
  //     else if (event instanceof RouteConfigLoadEnd) {
  //        // Route has been lazy loaded.
  //     }
  //      else if (event instanceof NavigationEnd) {
  //         // Navigation Ended Successfully.
  //          console.log(event.url);
  //          this.isReady = true;
  //          /** spinner ends after 5 seconds */
  //         //  setTimeout(() => {
  //         //   this.spinner.hide();
  //         //  }, 5000);

  //     }
  //     else if (event instanceof NavigationCancel) {
  //         // Navigation is canceled as the Route-Guard returned false during navigation.
  //     }
  //     else if (event instanceof NavigationError) {
  //         // Navigation fails due to an unexpected error.
  //           console.log(event.error);
  //     }
  // });

    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDuFtbUDiLeDLKaQ6uXCgwKIt7LKiidMG8",
      authDomain: "dadanshow-ecommerce.firebaseapp.com",
      databaseURL: "https://dadanshow-ecommerce-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "dadanshow-ecommerce",
      storageBucket: "dadanshow-ecommerce.appspot.com",
      messagingSenderId: "45826047167",
      appId: "1:45826047167:web:3aec0f02c7f7160c2d9a0a",
      measurementId: "G-MDBY2D417E"
    };
    firebase.initializeApp(firebaseConfig);
  }
}
