import COUNTRIES from '../model/countries';
import FIDE_TITLES from '../model/fideTitles';
import { Router } from '@angular/router';
import { UserService } from './../core/user.service';
import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from '../model/userdto.model';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userData: UserDto = new UserDto();
  dateOfBirth: NgbDate = new NgbDate(2000, 0, 0);
  avatarfile: File;
  fideTitles = FIDE_TITLES;
  countries = COUNTRIES;
  userAlreadyExists = false;
  signUpError = false;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.userData.dateOfBirth = this.dateOfBirth.year + '-' + this.dateOfBirth.month + '-' + this.dateOfBirth.day;
    this.userService.signUp(this.userData, this.avatarfile).subscribe(
      data =>  this.router.navigate(['home']) ,
      (error: HttpErrorResponse) => {
        if (error.status === 409) { this.userAlreadyExists = true; } else { this.signUpError = true; }
      });

  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.avatarfile = event.target.files[0];
    }
  }

}
