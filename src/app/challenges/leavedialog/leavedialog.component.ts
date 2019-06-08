import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-leavedialog',
  templateUrl: './leavedialog.component.html',
  styleUrls: ['./leavedialog.component.css']
})
export class LeavedialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LeavedialogComponent>, @Inject(MAT_DIALOG_DATA) protected data: {} ) {}

  leave(){
    this.dialogRef.close(true);
  }
  cancel(){
    this.dialogRef.close(false);
  }
}
