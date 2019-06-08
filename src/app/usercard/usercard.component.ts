import { Component, OnInit, Input } from '@angular/core';
import { UserDto } from '../model/userdto.model';
import {dataURItoBlob, createImageFromBlob} from '../utils/utils';

export const ratingTypesFilter = {
  bullet : 0,
  blitz : 1,
  rapid : 2,
  all : 3
};

@Component({
  selector: 'app-usercard',
  templateUrl: './usercard.component.html',
  styleUrls: ['./usercard.component.css']
})
export class UsercardComponent implements OnInit {

  @Input() user: UserDto;
  @Input() ratingType: string;
  avatarBlob: any;
  ratingTypesFilter = ratingTypesFilter;
  dataURItoBlob = dataURItoBlob;
  createImageFromBlob = createImageFromBlob;
  constructor() {
  }

  ngOnInit() {
    if (this.user.avatarData && this.user.avatarType) {
      this.createImageFromBlob(this.user.avatarData, this.user.avatarType).then(blob => this.avatarBlob = blob);
    }
  }

}
