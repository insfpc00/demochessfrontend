import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatchResult, matchMessageTypes } from './matchresult';

@Component({
  selector: 'app-matchresultdialog',
  templateUrl: './matchresultdialog.component.html',
  styleUrls: ['./matchresultdialog.component.css', '../board.component.css'],
})

export class MatchResultDialogComponent implements OnInit {

  resultType: number;
  label: string;

  constructor(
    public dialogRef: MatDialogRef<MatchResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatchResult, private router: Router) {
  }

  ngOnInit(): void {
    this.setLabels();
  }

  private setLabels() {
    switch (this.data.result.message) {
      case matchMessageTypes.winByDisconnection:
        this.label = this.data.opusername + ' disconnected!';
        this.resultType = 0;
        break;
      case matchMessageTypes.lossByResignation:
        this.label = 'You resigned!';
        this.resultType = 1;
        break;
      case matchMessageTypes.winByResignation:
        this.label = this.data.opusername + ' resigned!';
        this.resultType = 0;
        break;
      case matchMessageTypes.drawByAgreement:
        this.label = 'Draw by agreement!';
        this.resultType = 2;
        break;
      case matchMessageTypes.checkMate:
        this.label = 'Checkmate!';
        this.resultType = 0;
        break;
      case matchMessageTypes.checkMated:
        this.label = 'Loss by checkmate!';
        this.resultType = 1;
        break;
      case matchMessageTypes.staleMate:
        this.label = 'Stalemate!';
        this.resultType = 2;
        break;
      case matchMessageTypes.threeFoldRepetitionDraw:
        this.label = 'Theefold repetition! draw';
        this.resultType = 2;
        break;
      case matchMessageTypes.lossOnTime:
        this.label = 'Lost on time!';
        this.resultType = 1;
        break;
      case matchMessageTypes.winByTime:
        this.label = 'Win by time!';
        this.resultType = 0;
        break;
      case matchMessageTypes.wrongMove:
        this.label = 'Wrong move (probably cheating)';
        this.resultType = 1;
        break;
      case matchMessageTypes.wrongMove:
        this.label = 'Wrong move (probably cheating)';
        this.resultType = 1;
        break;
      case matchMessageTypes.insufficientMaterialDraw:
        this.label = 'Insufficient material';
        this.resultType = 2;
        break;
      case matchMessageTypes.fiftyMoveRuleRepetitionDraw:
        this.label = 'Fifty move rule repetition draw';
        this.resultType = 2;
        break;
    }
  }
goTo( route: string) {
  this.dialogRef.close();
  this.router.navigate([route]);
}

}
