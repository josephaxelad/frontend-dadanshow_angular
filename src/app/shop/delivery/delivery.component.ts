import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Country } from 'src/app/models/country';
import { UserDeliveries } from 'src/app/models/user-deliveries';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { CountriesService } from 'src/app/services/countries.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliveryForm : FormGroup;
  newDeliveryForm : FormGroup;
  isShowNewDeliveryForm : boolean = false;
  countries : Country[] = [];
  countriesSub : Subscription;
  userDeliveriesAddress : UserDeliveries[] = [];
  errorMessage : string = null;
  errorMessageNewDeliveryForm: string= null;


  constructor(
    private fb: FormBuilder,
    private countriesService : CountriesService,
    private usersService : UsersService,
    private cartservice : CartService,
    private router : Router,
    private alertService : AlertService) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.initDeliveryForm();
    this.initNewDeliveryFormDeliveryForm();
    this.usersService.getUserDeliveryAddressFromServer();
    this.getCountriesFromServer();
    this.getUserDeliveriesAddress();

            //Console
            console.log(this.userDeliveriesAddress);
  }

  initDeliveryForm(){
    this.deliveryForm = new FormGroup({
      delivery : this.fb.control("empty",[Validators.required])
    });
  }

  initNewDeliveryFormDeliveryForm(){
    this.newDeliveryForm = new FormGroup({
      address : this.fb.control('',[Validators.required]),
      zip : this.fb.control('',[Validators.required]),
      country : this.fb.control('0',[Validators.required]),
      city : this.fb.control('',[Validators.required]),
      phone : this.fb.control('',[Validators.required]),
    });
  }

  deliveryChange() {
    const deliveryIndex = this.deliveryForm.get('delivery').value;
    if (deliveryIndex==-1) {
      this.isShowNewDeliveryForm=true;
    } else {
      this.isShowNewDeliveryForm=false;
      const currentUserDeliveryAddress = this.userDeliveriesAddress.find((x)=> x==this.userDeliveriesAddress[deliveryIndex]);
      this.selectCurrentUserDeliveryAddress(currentUserDeliveryAddress);
    }
  }

  getCountriesFromServer(){
    this.countriesService.countriesSubject.subscribe(
      (data : Country[])=>{
        this.countries=data;
      },
      (error)=>{
      }
    );
    this.countriesService.emitCountries();
  }

  getUserDeliveriesAddress(){
    this.usersService.userDeliveriesAddressSubject.subscribe(
      (data : UserDeliveries[])=>{
        this.userDeliveriesAddress= data;
      }
    );
    this.usersService.emitUserDeliveryAddress();
  }

  selectCurrentUserDeliveryAddress(userDeliveriesAddress : UserDeliveries){
    this.usersService.updateCurrentUserDeliveryAddress(userDeliveriesAddress);
  }

  addNewUserDeliveryAddress(){
    const deliveryIndex = this.deliveryForm.get('delivery').value;
    if (deliveryIndex != 'empty') {
      if (deliveryIndex==-1) {
        const address = this.newDeliveryForm.get('address').value;
        const idCountry = this.newDeliveryForm.get('country').value;
        const zip = this.newDeliveryForm.get('zip').value;
        const city = this.newDeliveryForm.get('city').value;
        const phone = this.newDeliveryForm.get('phone').value;

        const country = this.countries.find(country => country.id === idCountry);

        const newDeliveryAddress = {
          'address' : address,
          'zip' : zip,
          'country' : country,
          'city' : city,
          'phone' : phone
        };
        if (this.newDeliveryForm.invalid || idCountry==0) {
          this.errorMessageNewDeliveryForm="Veuillez bien remplir le formulaire !";
          setTimeout(() => {
            this.errorMessageNewDeliveryForm=null;
          }, 5000);
        } else {
          this.usersService.addNewDeliveryAddress(newDeliveryAddress);
          this.selectCurrentUserDeliveryAddress(newDeliveryAddress);
          this.router.navigate(['/checkout']);
        }

      } else {
        this.router.navigate(['/checkout']);
      }
    } else {
      this.errorMessage="Veuillez choisir une adresse de livraison svp !";
      setTimeout(() => {
        this.errorMessage=null;
      }, 5000);
    }

  }




}
