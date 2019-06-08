import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

export const puzzleResult = {
  SOLVED: 0,
  TIMEDOUT: 1,
  ERRORS_EXCEEDED: 2
};

@Component({
  selector: 'app-enddialog',
  templateUrl: './enddialog.component.html',
  styleUrls: ['./enddialog.component.css']
})
export class EndDialogComponent implements OnInit {

  label: string;
  constructor(
    public dialogRef: MatDialogRef<EndDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private router: Router) {
  }

  ngOnInit() {
    switch (this.data) {
      case puzzleResult.SOLVED:
        this.label = 'Puzzle solved!';
        break;
      case puzzleResult.TIMEDOUT:
        this.label = 'Time out!';
        break;
      case puzzleResult.ERRORS_EXCEEDED:
        this.label = 'Maximum allowed errors exceeded!';
        break;
    }
  }


  goTo(route: string) {
    this.dialogRef.close(route === '');
    if (route && route !== '') {
      this.router.navigate([route]);
    }

  }
}
