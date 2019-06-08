import { AngularSvgIconModule } from 'angular-svg-icon';
import { IconwrapperComponent } from './iconwrapper.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [IconwrapperComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule.forRoot(),
    NgbModule
  ],
  exports: [
    IconwrapperComponent
  ]
})
export class IconWrapperModule { }
