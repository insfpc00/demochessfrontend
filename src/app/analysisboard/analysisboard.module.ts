import { AnalysisBoardComponent } from './analysisboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorePipe } from './score.pipe';
import { ChessBoardModule } from '../chessboard/chessboard.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [AnalysisBoardComponent, ScorePipe],
  imports: [ CommonModule, ChessBoardModule, NgbModule ],
  exports: [
    AnalysisBoardComponent
  ]
})
export class AnalysisBoardModule { }
