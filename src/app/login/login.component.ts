import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/user.service';
import { AuthToken } from '../core/authtoken';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = { username: '', password: '' };
  public invalidLogin = false;
  errorMessage = '';
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }


  onSubmit() {

    this.userService.login(this.loginData).then(() => {
      this.router.navigate(['home']);
    },
      error => { this.errorMessage = 'Invalid credentials!'}
    );
  }

  loginAsGuest() {

    this.userService.loginAsGuest().then(() => {
      this.router.navigate(['home']);
    },
      error => { this.errorMessage = 'Invalid credentials!'}
    );
   }

  ngOnInit() {
    window.sessionStorage.removeItem('token');
  }

}
