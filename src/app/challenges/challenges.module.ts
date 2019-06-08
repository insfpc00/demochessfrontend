import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChallengeschartComponent } from './challengeschart/challengeschart.component';
import { ChallengesComponent } from './challenges.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavedialogComponent } from './leavedialog/leavedialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchableModule } from '../searchable/searchable.module';
import { SortableModule } from '../sortable/sortable.module';
import { TimeControlModule } from '../timecontrol/timecontrol.module';
import { ColorModule } from '../matchcolor/color.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IconWrapperModule } from '../iconwrapper/iconwrapper.module';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    ChallengesComponent,
    ChallengeschartComponent,
    LeavedialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SearchableModule,
    SortableModule,
    TimeControlModule,
    ColorModule,
    AngularSvgIconModule,
    IconWrapperModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [
    ChallengesComponent
  ],
  entryComponents: [LeavedialogComponent]
})
export class ChallengesModule { }
