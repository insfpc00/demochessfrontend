import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Match } from 'src/app/model/match.model';
import { Piece } from '../model/piece';
import { ClockComponent } from 'src/app/clock/clock.component';

@Component({
  selector: 'app-playerpanel',
  templateUrl: './playerpanel.component.html',
  styleUrls: ['./playerpanel.component.css', '../chessboard.component.css']
})
export class PlayerpanelComponent implements OnInit {

  @Input()
  match: Match;

  @Input()
  droppedPieces: Piece[];

  @Input()
  showWhite: boolean;

  @Input()
  flipped: boolean;

  @Input()
  pieces: Piece[];

  @ViewChild('clock')
  clock!: ClockComponent;

  constructor() { }
  ngOnInit() {
  }

}
