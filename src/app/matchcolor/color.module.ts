import { MatchColorPipe } from './color.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MatchColorPipe],
  imports: [
    CommonModule
  ],
  exports: [
    MatchColorPipe
  ]
})
export class ColorModule { }
