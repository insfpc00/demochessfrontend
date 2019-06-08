import { IconWrapperModule } from './../iconwrapper/iconwrapper.module';
import { FormsModule } from '@angular/forms';
import { UserCardModule } from './../usercard/usercard.module';
import { TimeControlModule } from './../timecontrol/timecontrol.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedPipesModule } from '../sharedpipes/sharedpipes.module';
import { ColorModule } from '../matchcolor/color.module';

@NgModule({
  declarations: [DashboardComponent, StatsComponent],
  imports: [
    CommonModule, NgbModule, TimeControlModule, UserCardModule, FormsModule, IconWrapperModule, SharedPipesModule, ColorModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashBoardModule { }
