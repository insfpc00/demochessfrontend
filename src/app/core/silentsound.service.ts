import { SoundService } from './sound.service';
import { Injectable } from '@angular/core';

@Injectable()

export class SilentSoundService implements SoundService {
  doMoveSound(moveAcn: string): void {
  }
  doBellSound(): void {
  }
  doNotificationSound(): void {
  }
  doSocialNotificationSound(): void {
  }
  doOtherNotificationSound(): void {
  }
  doErrorSound(): void {
  }

}
