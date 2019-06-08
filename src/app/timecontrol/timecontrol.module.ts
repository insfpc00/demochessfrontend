import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeControlPipe, TimeControlTypePipe } from './timecontrol.pipe';

@NgModule({
  declarations: [TimeControlPipe, TimeControlTypePipe],
  imports: [
    CommonModule
  ],
  exports: [
    TimeControlPipe, TimeControlTypePipe
  ]
})
export class TimeControlModule { }
