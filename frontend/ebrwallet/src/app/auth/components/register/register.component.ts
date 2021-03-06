import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  form : FormGroup;
  
  message : string;

  error : string;

  constructor(@Inject(FormBuilder) fb: FormBuilder, private authService : AuthService ) {
    
    var defaultValidator = Validators.compose([
                              Validators.required, 
                              Validators.minLength(2), 
                              Validators.maxLength(32)
                            ]);
    // Password rule :  Password must be  6 - 20 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.
    var passwordValidator = Validators.compose([
                              Validators.required,
                              Validators.maxLength(20),
                              Validators.pattern(/^.*(?=.{7,20})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]*$/)
                            ]);
    // Username rule: should be minimum 4 and maximum 15 characters. Alphanumeric characters are allowed. special characters ._ are allowed. No spaces are acceptable. The starting character should be alphabet.
    var usernameValidator = Validators.compose([
                              Validators.required,
                              Validators.pattern("[A-Za-z][A-Za-z0-9._]{3,14}")
                            ]);

    this.form = fb.group({
    
      name : fb.group({
        first: ['', defaultValidator ],
        last : ['', defaultValidator ]
      }),
      email: ['', [Validators.email, defaultValidator]],
      password: ['', [ passwordValidator ]],
      // confirmPassword: [''],
      // username: ['', [ usernameValidator]],
      country: ['', [ Validators.required] ],
      city : ['', [ defaultValidator] ],
      phone: ['', [ defaultValidator] ]
    }, 
    // { validator : this.matchingPasswords('password', 'confirmPassword')}
    )
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ngOnInit() {
  
  }

  onSubmit(formValue) : void {
    var body = {
      firstName : formValue.name.first,
      lastName : formValue.name.last,
      email : formValue.email,
      password : formValue.password,
      country: formValue.country,
      city : formValue.city,
      username: formValue.username,
      phone: formValue.phone
    }


    this.authService
      .register(body)
      .then(res => {

        if (res.error) {
          console.log(res.errorMsg)
          this.error= res.errorMsg.reduce(function(acc,msg){
            return acc + msg
          }, '')
          return 
        }
        this.message = res.message        
      })
      .catch(err => {
        err = err.json();
        this.error= err.errorMsg.reduce(function(acc,msg){
          return acc + msg + '<br/>'
        }, '')}
      )
  }

}
