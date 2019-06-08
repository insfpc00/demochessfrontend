import { ChessBoardModule } from './../chessboard/chessboard.module';
import { ClockModule } from './../clock/clock.module';
import { FormsModule } from '@angular/forms';
import { EndDialogComponent } from './puzzle/enddialog/enddialog.component';
import { IconWrapperModule } from './../iconwrapper/iconwrapper.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzlesComponent } from './puzzles.component';
import { SliderComponent } from './puzzle/slider/slider.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { RouterModule } from '@angular/router';
import { SearchableModule } from '../searchable/searchable.module';

@NgModule({
  declarations: [PuzzlesComponent, PuzzleComponent, EndDialogComponent, SliderComponent ],
  imports: [
    CommonModule, NgbModule, IconWrapperModule, FormsModule, RouterModule, ClockModule, ChessBoardModule, SearchableModule
  ],
  exports: [
    PuzzlesComponent
  ],
  entryComponents: [EndDialogComponent]
})
export class PuzzlesModule { }
