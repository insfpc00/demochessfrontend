import { ClockComponent } from 'src/app/clock/clock.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ClockComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    ClockComponent
  ]
})
export class ClockModule { }
