import { FormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AccountComponent
  ]
})
export class AccountModule { }
