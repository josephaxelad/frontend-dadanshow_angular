import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  editPasswordForm : FormGroup;
  errorMessage : string =null;
  successMessage : string =null;
  constructor(private fb: FormBuilder,private usersService : UsersService) { }

  ngOnInit(): void {
    this.initEditPasswordForm();
  }

  initEditPasswordForm(){
    this.editPasswordForm = this.fb.group({
      oldPassword : this.fb.control('',[Validators.minLength(6),Validators.required]),
      newPassword :  this.fb.control('',[Validators.minLength(6),Validators.required]),
      reNewPassword : this.fb.control('',[Validators.minLength(6),Validators.required]),
    })
  }

  onSubmit(){
    const oldPassword = this.editPasswordForm.get('oldPassword').value;
    const newPassword = this.editPasswordForm.get('newPassword').value;
    const reNewPassword = this.editPasswordForm.get('reNewPassword').value;
    if (this.editPasswordForm.invalid) {
      this.errorMessage="formulaire mal rempli, veuillez recommencer svp!";
        setTimeout(() => {
          this.errorMessage=null;
        }, 3000);
    } else {
      if (newPassword ==  reNewPassword) {
        this.usersService.updateCurrentUserPassword(oldPassword,newPassword)
        .then((data) =>{
          this.successMessage='Mot de passe mis à jour';
          setTimeout(() => {
            this.successMessage=null;
          }, 3000);
        })
        .catch((error) =>{
          this.errorMessage=error;
          setTimeout(() => {
            this.errorMessage=null;
          }, 3000);
        })
      } else {
        this.errorMessage='Mots de passe saisis différents';
        setTimeout(() => {
          this.errorMessage=null;
        }, 3000);
      }
    }


  }

}

