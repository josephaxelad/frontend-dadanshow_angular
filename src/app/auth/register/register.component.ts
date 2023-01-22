import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;
  errorMessage;
  successMessage;
  isShow : boolean =false;
  isShow_ : boolean =false;
  typePass1="password"
  typePass2="password"
  constructor(private fb :FormBuilder, private usersService : UsersService,private router : Router,private alertService : AlertService) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm(){
    this.registerForm = this.fb.group({
      lastname: this.fb.control('',[Validators.required]),
      firstname: this.fb.control('',[Validators.required]),
      email: this.fb.control('',[Validators.required,Validators.email]),
      password: this.fb.control('',[Validators.required]),
      repassword: this.fb.control('',[Validators.required]),
    });
  }

  onSubmit(){
    const  lastnameUser = this.registerForm.get('lastname').value;
    const  firstnameUser = this.registerForm.get('firstname').value;
    const  emailUser = this.registerForm.get('email').value;
    const  passwordUser = this.registerForm.get('password').value;
    const  rePasswordUser = this.registerForm.get('repassword').value;

    if (rePasswordUser==passwordUser) {
      const newUser: Users = {
        firstname: firstnameUser,
        lastname : lastnameUser,
        email : emailUser,
        password : passwordUser,
        type : 1
        }

      this.usersService.createUser(newUser)
      .then(
      (data)=>{
      this.alertService.alert('Compte créé avec succès !',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
        this.router.navigate(['/home']);

      }
      )
      .catch((error)=>{
      this.errorMessage=error;
      setTimeout(() => {
      this.errorMessage=null;
      }, 3000);
      })

    } else {
      this.errorMessage="Mots de passe saisis différents !";
      setTimeout(() => {
      this.errorMessage=null;
      }, 3000);
    }


  }

  changeShow(){
    if (this.isShow) {
      this.isShow=false;
      this.typePass1="password"
    } else {
      this.isShow=true;
      this.typePass1="text"

    }

  }
  changeShow_(){
    if (this.isShow_) {
      this.isShow_=false;
      this.typePass2="password"
    } else {
      this.isShow_=true;
      this.typePass2="text"

    }
  }

}
