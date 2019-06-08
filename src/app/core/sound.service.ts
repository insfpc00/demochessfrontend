import { Injectable } from '@angular/core';

export abstract class SoundService{
  abstract doMoveSound(moveAcn: string): void;
  abstract doBellSound(): void ;
  abstract doNotificationSound(): void;
  abstract doSocialNotificationSound(): void;
  abstract doOtherNotificationSound(): void;
  abstract doErrorSound(): void;
}

@Injectable()
export class SoundServiceImp implements SoundService{

  constructor() { }

  public doMoveSound(moveAcn: string): void {
    if (moveAcn === 'O-O' || moveAcn === 'O-O-O') {
      this.play('castle');
    }
    if (moveAcn.includes('+')) {
      this.play('check');
    }
    if (moveAcn.includes('x')) {
      this.play('capture2');
    } else {
      if (Math.random() < 0.5) {
        this.play('move1');
      } else {
        this.play('move2');
      }
    }
  }

  public doBellSound(): void {
    this.play('bell');
  }

  public doNotificationSound(): void {
    this.play('notification1');
  }

  public doSocialNotificationSound(): void {
    this.play('message');
  }

  public doOtherNotificationSound(): void {
    this.play('notification2');
  }
  private play(file: string) {
    let audio = new Audio();
    audio.src = '../../assets/sounds/' + file + '.mp3';
    audio.load();
    audio.play();
  }

  public doErrorSound(): void{
    this.play('error');
  }

}
