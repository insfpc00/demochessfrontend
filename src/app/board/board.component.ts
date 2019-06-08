import { FlipPositionPipe } from './../chessboard/flip.pipe';
import { UserService } from './../core/user.service';
import { Match } from './../model/match.model';
import { MatchService } from './../core/matchservice.service';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Piece, Position, pieceType } from '../chessboard/model/piece';
import { Move, MoveDto } from '../chessboard/model/move';
import { Subscription, Observable, timer } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
/* import * as uuid from 'uuid/v1'; */

import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import {
  LeavedialogComponent
} from './leavedialog/leavedialog.component';
import {
  MatchResultDialogComponent
} from './matchresultdialog/matchresultdialog.component';
import { ChessboardComponent } from '../chessboard/chessboard.component';
import { SoundService } from '../core/sound.service';
import { CanComponentDeactivate } from '../can-deactivate.guard';
import { BoardService } from '../chessboard/model/board/boardservice';
import { soundServiceProvider } from '../core/sound.service.provider';
import { matchMessageTypes, MatchMessage } from './matchresultdialog/matchresult';

export interface UserMatchMessage {
  message: string;
}
export const userMessageTypes = {
  userOffersDraw: 'USER_OFFERS_DRAW',
  userResigned: 'USER_RESIGNS',
  userAcceptsDraw: 'USER_ACCEPTS_DRAW',
  userReady: 'USER_READY',
  chatDisabled: 'CHAT_DISABLED',
  chatEnabled: 'CHAT_ENABLED'
};





@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../chessboard/chessboard.component.css'],
  providers: [FlipPositionPipe, BoardService, soundServiceProvider]
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit, CanComponentDeactivate {
  match: Match;
  private movesTopicSubscription: Subscription;
  private matchTopicSubscription: Subscription;
  public user: string;
  flippedBoard: boolean;
  match$: Observable<Match>;
  userDisconnected = false;
  secondsLeftAfterLoss = 15;
  disconnectionTimer: Subscription;
  drawOffered = false;
  offeringDraw = false;
  matchReady = false;
  protected chatEnabled: boolean;
  @ViewChild('chessboard') chessBoard!: ChessboardComponent;
  private _canBeDeactivated = false;

  protected setChatEnabled(val: boolean) {
    this.chatEnabled = val;
    this.notifyChatDisabled();
  }

  constructor(
    private rxStompService: RxStompService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    public userService: UserService,
    public board: BoardService,
    private soundService: SoundService) {
    this.chatEnabled = true;
  }

  onSendMessage(move: Move) {
    const moveDto = {
      number: move.id,
      color: move.piece.isWhite,
      from: move.from,
      to: move.to,
      promotedTo: move.promotedTo,
    };
    this.rxStompService.publish({
      destination: '/app/move.' + this.match.matchId,
      body: JSON.stringify(moveDto)
    });
  }

  ngAfterViewInit() {
    this.checkForClocks();

  }

  private checkForClocks() {

    if (this.chessBoard.whitesPanel && this.chessBoard.blacksPanel &&
      this.chessBoard.whitesPanel.clock && this.chessBoard.blacksPanel.clock) {
      this.notifyReady();
      this.board.turnChange.subscribe(t => this.setTurn(t));
    } else {
      setTimeout(() => {
        this.checkForClocks();
      }, 10);
    }

  }
  openMatchResultDialog(message: MatchMessage): void {
    const me = this.board.iamWhitePieces ? this.match.whitePiecesUser.username : this.match.blackPiecesUser.username;
    const op = !this.board.iamWhitePieces ? this.match.whitePiecesUser.username : this.match.blackPiecesUser.username;
    const dialogRef = this.matDialog.open(MatchResultDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: { result: message, myusername: me, opusername: op }
    });
  }

  canDeactivate() {
    if (!this._canBeDeactivated) {
      return this.openLeaveDialog();
    } else {
      return true;
    }

  }
  async openLeaveDialog(): Promise<boolean> {
    const dialogRef = this.matDialog.open(LeavedialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {}
    });
    let leave: boolean;
    await dialogRef.afterClosed().toPromise().then(result => leave = result);
    if (leave) { this.resign(); }
    return leave;
  }



  ngOnDestroy() {
    if (this.movesTopicSubscription) {
      this.movesTopicSubscription.unsubscribe();
    }
    if (this.matchTopicSubscription) {
      this.matchTopicSubscription.unsubscribe();
    }
  }

  private setTurn(isWhiteTurn: boolean) {
    //this.board.setTurn(isWhiteTurn);
    if (isWhiteTurn) {
      this.chessBoard.whitesPanel.clock.start();
      this.chessBoard.blacksPanel.clock.stop();
    } else {
      this.chessBoard.whitesPanel.clock.stop();
      this.chessBoard.blacksPanel.clock.start();
    }
  }

  private initMovesTopicSuscription(): void {
    this.movesTopicSubscription = this.rxStompService
      .watch('/user/exchange/amq.direct/move.' + this.match.matchId)
      .subscribe((message: Message) => {
        const move: MoveDto = JSON.parse(message.body);
        this.board.doMove(move);
      });
  }

  private initMatchTopicSuscription(): void {
    this.matchTopicSubscription = this.rxStompService
      .watch('/user/exchange/amq.direct/match.' + this.match.matchId)
      .subscribe((message: Message) => {
        const matchMessage: MatchMessage = JSON.parse(message.body);
        switch (matchMessage.message) {

          case matchMessageTypes.userDisconnected:
            this.userDisconnects();
            break;
          case matchMessageTypes.winByDisconnection:
          case matchMessageTypes.winByResignation:
          case matchMessageTypes.lossByResignation:
          case matchMessageTypes.drawByAgreement:
          case matchMessageTypes.staleMate:
          case matchMessageTypes.checkMate:
          case matchMessageTypes.checkMated:
          case matchMessageTypes.threeFoldRepetitionDraw:
          case matchMessageTypes.winByTime:
          case matchMessageTypes.lossOnTime:
          case matchMessageTypes.wrongMove:
          case matchMessageTypes.fiftyMoveRuleRepetitionDraw:
          case matchMessageTypes.insufficientMaterialDraw:
            this.endMatch(matchMessage);
            break;
          case matchMessageTypes.userOffersDraw:
            this.userOffersDraw();
            break;
          case matchMessageTypes.matchStarted:
            this.matchStarted();
            break;
          case userMessageTypes.chatDisabled:
            this.chatEnabled = false;
            break;
        }

      });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const matchId = +params.matchId;
      this.match$ = this.matchService.getMatch(matchId);
      this.match$.subscribe(match => {
        this.match = match;
        this.soundService.doNotificationSound();
        this.board.iamWhitePieces =
          this.userService.loggedUser === match.whitePiecesUser.username;
        this.flippedBoard = !this.board.iamWhitePieces;
        this.initMovesTopicSuscription();
        this.initMatchTopicSuscription();
        this.board.initPieces();
      });
    });
  }

  private matchStarted() {
    this.matchReady = true;
  }
  private userDisconnects() {
    this.userDisconnected = true;
    this.secondsLeftAfterLoss = 15;
    this.disconnectionTimer = timer(1000, 1000).subscribe(t => {
      if (this.secondsLeftAfterLoss > 0) {
        this.secondsLeftAfterLoss--;
      } else {
        this.disconnectionTimer.unsubscribe();
      }
    });
  }

  private endMatch(message: MatchMessage) {
    this.userDisconnected = false;
    this._canBeDeactivated = true;
    this.soundService.doOtherNotificationSound();
    this.openMatchResultDialog(message);
    this.chessBoard.whitesPanel.clock.stop();
    this.chessBoard.blacksPanel.clock.stop();
    this.ngOnDestroy();
  }

  onDragEnd(event: PointerEvent, piece: Piece) {

    if (this.board.isMyTurn && this.matchReady && !this.userDisconnected) {
      this.board.tryToMovePiece(piece, (m: Move) => this.onSendMessage(m));
    } else {
      piece.cancelDrag();
    }
  }



  private sendMessage(messageType: string) {
    this.rxStompService.publish({
      destination: '/app/match.' + this.match.matchId,
      body: JSON.stringify({ message: messageType })
    });
  }

  notifyReady(): void {
    this.match$.toPromise().then(m => this.sendMessage(userMessageTypes.userReady));
  }

  resign(): void {
    this.sendMessage(userMessageTypes.userResigned);
  }
  notifyChatDisabled(): void {
    this.sendMessage(userMessageTypes.chatDisabled);
  }
  offerDraw(): void {
    this.offeringDraw = true;
    this.sendMessage(userMessageTypes.userOffersDraw);
  }
  acceptDraw(): void {
    this.sendMessage(userMessageTypes.userAcceptsDraw);
  }
  userOffersDraw(): void {
    this.drawOffered = true;
  }
}
