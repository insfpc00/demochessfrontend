import { UserService } from './../core/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }
}
