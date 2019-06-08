import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule, FormsModule, NgbModule, ReactiveFormsModule,

  ],
  exports: [
    SignupComponent
  ]
})
export class SignUpModule { }
