import COUNTRIES from '../model/countries';
import FIDE_TITLES from '../model/fideTitles';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { UserDto } from '../model/userdto.model';
import { dataURItoBlob, createImageFromBlob } from '../utils/utils';

export const themes = ['DEFAULT', 'CYBORG', 'DARKLY', 'LUMEN', 'PULSE', 'SOLAR'];

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: UserDto = new UserDto();
  avatarfile: File;
  fideTitles = FIDE_TITLES;
  countries = COUNTRIES;
  changePasswordData = { newPassword: '', oldPassword: '' };
  passwordChanged = false;
  updateUserData = { country: '', theme: '', title: '', soundEnabled: true };
  userUpdated = false;
  repeatedPassword: string;
  differentPasswords = false;
  themes = themes;
  dataURItoBlob = dataURItoBlob;
  createImageFromBlob = createImageFromBlob;
  avatarBlob: any;
  avatarUploaded = false;
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    const user = this.userService.getLoggedUserProfile();

    this.userData = user;
    this.updateUserData.country = user.country;
    this.updateUserData.title = user.fideTitle;
    this.updateUserData.theme = user.theme;
    this.updateUserData.soundEnabled = user.soundEnabled;
    this.createImageFromBlob(user.avatarData, user.avatarType).then(blob => this.avatarBlob = blob);

  }

  onUserUpdateSubmit(): void {
    this.userService.updateUser(this.updateUserData).subscribe(data => this.userUpdated = true);
  }

  onSubmitChangePassword(): void {
    this.differentPasswords = this.repeatedPassword !== this.changePasswordData.newPassword;
    if (!this.differentPasswords) {
      this.userService.changePassword(this.changePasswordData).subscribe(d => this.passwordChanged = true);
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.avatarfile = event.target.files[0];
    }
  }
  uploadAvatar() {
    this.userService.uploadAvatar(this.avatarfile).subscribe(r => this.userService.getUserProfile().subscribe(user => {
      this.userData = user;
      this.avatarUploaded = true;
      this.createImageFromBlob(user.avatarData, user.avatarType).then(blob => this.avatarBlob = blob);
    }));
  }
}
