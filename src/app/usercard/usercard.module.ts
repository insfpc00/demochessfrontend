import { UsercardComponent } from './usercard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconWrapperModule } from '../iconwrapper/iconwrapper.module';

@NgModule({
  declarations: [UsercardComponent],
  imports: [
    CommonModule, IconWrapperModule
  ],
  exports: [
    UsercardComponent
  ]
})
export class UserCardModule { }
