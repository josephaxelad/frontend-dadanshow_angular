import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { Country } from 'src/app/models/country';
import { DeliveryZone } from 'src/app/models/delivery-zone';
import { UserDeliveries } from 'src/app/models/user-deliveries';
import { CountriesService } from 'src/app/services/countries.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-deliveries',
  templateUrl: './my-deliveries.component.html',
  styleUrls: ['./my-deliveries.component.css']
})
export class MyDeliveriesComponent implements OnInit {

  userDeliveries: UserDeliveries[] = [];
  userDeliveriesSub : Subscription;
  countries : Country[] = [];
  countriesSub : Subscription;
  addNewDeliveryAddressForm : FormGroup;
  updateDeliveryAddressForm : FormGroup;
  errorMessage : string =null;
  successMessage : string =null;
  warningMessage : string = null;
  errorMessageAddNewDeliveryAddressForm : string =null;
  errorMessageUpdateDeliveryAddressForm : string =null;
  addNewDeliveryAddressExpanded : boolean = false;
  updateDeliveryAddressExpanded : boolean = false;

  constructor(private fb : FormBuilder,private http : HttpClient,private usersService : UsersService,private countriesService : CountriesService) { }

  ngOnInit(): void {
    this.getCountriesFromServer();
    this.initaddNewDeliveryAddressForm();
    this.initUpdateDeliveryAddressForm({address:'',zip: null,country:{'id':null,'name':null,'idDeliveryZone':null,'code':null},city:'',phone:''});
    this.userDeliveriesSub = this.usersService.userDeliveriesAddressSubject.subscribe(
      (data : UserDeliveries[])=>{
        this.userDeliveries=data;
      }
    );
    this.usersService.emitUserDeliveryAddress();
  }

  initUpdateDeliveryAddressForm(userDelivery :UserDeliveries){
    this.updateDeliveryAddressForm = this.fb.group({
      address : this.fb.control(userDelivery.address,[Validators.required]),
      zip : this.fb.control(userDelivery.zip,[Validators.required]),
      country : this.fb.control(userDelivery.country.id,[Validators.required]),
      city : this.fb.control(userDelivery.city,[Validators.required]),
      phone : this.fb.control(userDelivery.phone,[Validators.required]),
    });
    this.errorMessage=null;
    this.successMessage=null;
  }

  initaddNewDeliveryAddressForm(){
    this.addNewDeliveryAddressForm = this.fb.group({
      address : this.fb.control('',[Validators.required]),
      zip : this.fb.control('',[Validators.required]),
      country : this.fb.control('0',[Validators.required]),
      city : this.fb.control('',[Validators.required]),
      phone : this.fb.control('',[Validators.required]),
    })
  }

  addNewDeliveryAddress(){
    const email = this.usersService.currentUser;

    const address = this.addNewDeliveryAddressForm.get('address').value;
    const zip = this.addNewDeliveryAddressForm.get('zip').value;
    const idCountry = this.addNewDeliveryAddressForm.get('country').value;
    const city = this.addNewDeliveryAddressForm.get('city').value;
    const phone = this.addNewDeliveryAddressForm.get('phone').value;

    const country = this.countries.find(country => country.id === idCountry);

    const deliveryAddress = {
      'address' : address,
      'zip' : zip,
      'country' : country,
      'city' : city,
      'phone' : phone
    };

    if (this.addNewDeliveryAddressForm.invalid || idCountry == 0) {
      this.errorMessageAddNewDeliveryAddressForm="Veuillez bien remplir le formulaire svp!";
      setTimeout(() => {
        this.errorMessageAddNewDeliveryAddressForm=null;
      }, 5000);
    } else {

      this.addNewDeliveryAddressExpanded=false;
      this.usersService.addNewDeliveryAddress(deliveryAddress)
    .then((data)=>{
      //"Adresse de livraison ajoutée"
      console.log(this.addNewDeliveryAddressExpanded);
      window.scrollTo(0,0);
      this.initaddNewDeliveryAddressForm();
      this.successMessage="Adresse de livraison ajoutée";
      setTimeout(() => {
        this.successMessage=null;
      }, 5000);
    })
    .catch((error)=>{
      //"Une erreur a été rencontrée"
      this.errorMessageAddNewDeliveryAddressForm="Une erreur à été rencontrée";
      setTimeout(() => {
        this.errorMessageAddNewDeliveryAddressForm=null;
      }, 5000);
    })
    }



  }

  updateDeliveryAddress(userDelivery : UserDeliveries) {
    const address = this.updateDeliveryAddressForm.get('address').value;
    const zip = this.updateDeliveryAddressForm.get('zip').value;
    const idCountry = this.updateDeliveryAddressForm.get('country').value;
    const city = this.updateDeliveryAddressForm.get('city').value;
    const phone = this.updateDeliveryAddressForm.get('phone').value;

    const country = this.countries.find(country => country.id === idCountry);

    const newDeliveryAddress = {
      'address' : address,
      'zip' : zip,
      'country' : country,
      'city' : city,
      'phone' : phone
    };

    if (this.updateDeliveryAddressForm.invalid ) {

      this.errorMessageUpdateDeliveryAddressForm="Veuillez bien remplir le formulaire svp!";
      setTimeout(() => {
        this.errorMessageUpdateDeliveryAddressForm=null;
      }, 5000);
    } else {
      if (JSON.stringify(newDeliveryAddress)!==JSON.stringify(userDelivery)) {
        this.usersService.updateDeliveryAddressInServer(userDelivery,newDeliveryAddress)
        .then((data)=>{
          //"Adresse de livraison mise à jour"
          this.updateDeliveryAddressExpanded=false;
          window.scrollTo(0,0);
          this.successMessage="Adresse de livraison livraison mise à jour";
          setTimeout(() => {
            this.successMessage=null;
          }, 5000);
        })
        .catch((error)=>{
          //"Une erreur a été rencontrée"
          // this.initUpdateDeliveryAddressForm(userDelivery);
          this.errorMessageUpdateDeliveryAddressForm="Une erreur a été rencontré, mise à jour non effectuée !";
          setTimeout(() => {
            this.errorMessageUpdateDeliveryAddressForm=null;
          }, 5000);
        })
      } else {
        this.errorMessageUpdateDeliveryAddressForm="Aucun changement, mise à jour non effectuée !";
          setTimeout(() => {
            this.errorMessageUpdateDeliveryAddressForm=null;
          }, 5000);
      }
    }

  }

  deleteDeliveryAddress(userDelivery : UserDeliveries) {
    this.usersService.deleteDeliveryAddressToServer(userDelivery)
    .then((data)=>{
      //"Adresse de livraison supprimée"
      window.scrollTo(0,0);
      this.warningMessage="Adresse de livraison supprimée avec succès !";
      setTimeout(() => {
        this.warningMessage=null;
      }, 5000);
    })
    .catch((error)=>{
      //"Une erreur a été rencontrée"
      // this.initUpdateDeliveryAddressForm(userDelivery);
      this.errorMessage="Erreur lors de la suppression, adresse de livraison non supprimé !";
      setTimeout(() => {
        this.errorMessage=null;
      }, 5000);
    })
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
}
