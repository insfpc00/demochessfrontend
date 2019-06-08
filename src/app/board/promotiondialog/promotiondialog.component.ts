import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  pieceType: string;
  isWhite: boolean;
}

@Component({
  selector: 'app-promotion-dialog',
  templateUrl: './promotiondialog.component.html',
  styleUrls: ['./promotiondialog.component.css', '../board.component.css', '../../chessboard/chessboard.component.css']
})
export class PromotionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PromotionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  public selectPiece(piece: string) {
    this.data.pieceType = piece;
    this.dialogRef.close(this.data);
  }

}
