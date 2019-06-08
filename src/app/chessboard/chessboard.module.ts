import { DraggableModule } from './../draggable/draggable.module';
import { DraggableDirective } from './../draggable/draggable.directive';
import { BasicboardComponent } from './basicboard/basicboard.component';
import { FlipPositionPipe } from './flip.pipe';
import { AdvantagePipe } from './advantage.pipe';
import { ClockModule } from './../clock/clock.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerpanelComponent } from './playerpanel/playerpanel.component';
import { ChessboardComponent } from './chessboard.component';
import { UserCardModule } from '../usercard/usercard.module';
import { TimeControlModule } from '../timecontrol/timecontrol.module';
import { SharedPipesModule } from '../sharedpipes/sharedpipes.module';
import { ResizableModule } from 'angular-resizable-element';
import { ResizeDirective } from './basicboard/resize.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ PlayerpanelComponent, AdvantagePipe, FlipPositionPipe, ChessboardComponent, BasicboardComponent, ResizeDirective],
  imports: [
    CommonModule, ClockModule, UserCardModule, TimeControlModule, SharedPipesModule,
    DraggableModule, ResizableModule, BrowserAnimationsModule
  ],
  exports: [ChessboardComponent, BasicboardComponent ]
})
export class ChessBoardModule { }
