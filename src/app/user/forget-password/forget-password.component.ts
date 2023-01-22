import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,private usersService : UsersService) { }

  forgetPasswordForm : FormGroup;
  successMessage : string = null;
  errorMessage :  string = null;

  ngOnInit(): void {
    this.initForgetPasswordForm();
  }

  initForgetPasswordForm(){
    this.forgetPasswordForm = this.fb.group({
      email : this.fb.control('',[Validators.required]),

    })
  }

  resetPassword(){
    const email = this.forgetPasswordForm.get('email').value;
    if (this.forgetPasswordForm.invalid) {
      this.errorMessage="formulaire mal rempli, veuillez recommencer svp!";
      setTimeout(() => {
        this.errorMessage=null;
      }, 3000);
    } else {
      this.usersService.resetPassword(email)
      .then((data)=>{
        this.successMessage= "Un message de réinitialisation a été envoyé sur votre mail";
          setTimeout(() => {
            this.successMessage=null;
          }, 3000);
      })
      .catch((error)=>{
        this.errorMessage= error;
          setTimeout(() => {
            this.errorMessage=null;
          }, 3000);
      })
    }

  }

}
