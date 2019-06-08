import { ChessBoardModule } from './../chessboard/chessboard.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { PromotionDialogComponent } from './promotiondialog/promotiondialog.component';
import { MatchResultDialogComponent } from './matchresultdialog/matchresultdialog.component';
import { LeavedialogComponent } from './leavedialog/leavedialog.component';
import { SharedPipesModule } from '../sharedpipes/sharedpipes.module';
import { ChatModule } from '../chat/chat.module';

@NgModule({
  declarations: [BoardComponent, PromotionDialogComponent, MatchResultDialogComponent, LeavedialogComponent],
  imports: [
    CommonModule, ChessBoardModule, SharedPipesModule, ChatModule
  ],
  exports: [
    BoardComponent
  ],
  entryComponents: [PromotionDialogComponent, MatchResultDialogComponent, LeavedialogComponent]
})
export class BoardModule { }


