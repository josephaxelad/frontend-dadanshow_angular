import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mixinDisableRipple } from '@angular/material/core';
import { interval, Subscription } from 'rxjs';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit ,OnDestroy {

  editPersonalInfoForm : FormGroup;
  errorMessage : string =null;
  successMessage : string =null;
  userSubscription : Subscription;
  user : Users = {
    email : 'a',
    firstname : 'a' ,
    lastname : 'a' ,
  };
  currentUser;

  constructor(private fb: FormBuilder,private usersService : UsersService) {

  }

  ngOnInit(): void {
    this.editPersonalInfoForm = this.fb.group({
      lastname : this.fb.control('',[Validators.required]),
      firstname :  this.fb.control('',[Validators.required]),
    });
    this.usersService.getCurrentUser();
    this.getCurrentUserPersonalInfo();
    this.usersService.emitUser();
    this.currentUser = this.usersService.currentUser;
    this.initEditPersonalInfoForm();

  }


  getCurrentUserPersonalInfo(){
    return new Promise((resolve, reject) => {
      this.userSubscription = this.usersService.userSubject.subscribe(
        ((data)=>{
          this.user=data;
          resolve(data);
        }),
        ((error)=>{

        })

      );
    });


  }

  initEditPersonalInfoForm(){
    this.getCurrentUserPersonalInfo()
    .then((user : Users)=>{
      this.editPersonalInfoForm = this.fb.group({
        lastname : this.fb.control(user.lastname,[Validators.required]),
        firstname :  this.fb.control(user.firstname,[Validators.required]),
      });
    })

  }

  onSubmit(){
    const lastname = this.editPersonalInfoForm.get('lastname').value;
    const firstname = this.editPersonalInfoForm.get('firstname').value;
    const displayName = `${firstname} ${lastname}`;
    const newUserInfo = {
      email : this.currentUser,
      firstname : firstname ,
      lastname : lastname ,
    }
    const userInfo = {
      email : this.currentUser,
      firstname : this.user.firstname ,
      lastname : this.user.lastname ,
    }
    if (this.editPersonalInfoForm.invalid) {
      this.errorMessage="formulaire mal rempli, veuillez recommencer svp!";
        setTimeout(() => {
          this.errorMessage=null;
        }, 3000);
    } else {
      if (JSON.stringify(newUserInfo)!==JSON.stringify(userInfo)) {
        this.usersService.updateUserFirebase(displayName)
        .then(()=>{
          this.successMessage="Informations personnels mis à jour";
          setTimeout(() => {
            this.successMessage=null;
          }, 5000);
        })
        .catch((error)=>{
        });
        this.usersService.updateUser(newUserInfo);
      } else {
        this.errorMessage="Aucun changement, mise à jour non effectuée !";
        setTimeout(() => {
          this.errorMessage=null;
        }, 3000);
      }

    }
  }


  ngOnDestroy(): void{
    this.userSubscription.unsubscribe();
  }
}
