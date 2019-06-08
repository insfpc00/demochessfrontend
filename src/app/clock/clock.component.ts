import { ClockService } from './clock.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SoundService } from '../core/sound.service';

export const clockStates = { stopped: 'stopped', running: 'running' };

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit, OnDestroy {
  clockServiceSuscription: Subscription;
  @Input() id: number;
  @Input() remainingTime: number;
  @Input() increment: number;
  @Output() noRemainingTime = new EventEmitter<any>();
  state: string;
  lastTimeStamp: number;
  started = false;

  minutes: string;
  seconds: string;
  centiseconds: string;
  blink: boolean;
  warningTime: number;

  constructor(private clockService: ClockService, private soundService: SoundService) {
    this.state = clockStates.stopped;
  }

  ngOnInit() {
    this.setTime();
    this.warningTime = this.remainingTime / 10;
  }

  ngOnDestroy() {
    if (this.clockServiceSuscription && !this.clockServiceSuscription.closed) {
      this.clockServiceSuscription.unsubscribe();
    }
  }
  public setRemainingTime(remainingTime: number) {
    this.remainingTime = remainingTime;
    this.setTime();
  }

  start() {

    if (this.state !== clockStates.running && this.remainingTime > 0) {

      if (this.started) {
        this.remainingTime += this.increment;
      } else {
        this.started = true;
      }
      this.lastTimeStamp = new Date().getTime();
      this.clockServiceSuscription = this.clockService
        .getTime()
        .subscribe(t => {
            this.remainingTime -= t - this.lastTimeStamp;
            this.lastTimeStamp = t;
            if (this.remainingTime < 0) {
            this.remainingTime = 0;
            this.noRemainingTime.emit({});
            this.clockServiceSuscription.unsubscribe();
          }
            this.setTime();
        });
      this.state = clockStates.running;
    }
  }

  stop() {
    if (this.state !== clockStates.stopped) {
      this.clockServiceSuscription.unsubscribe();
      this.state = clockStates.stopped;
    }
  }
  private setTime() {
    this.setMinutes();
    this.setSeconds();
    this.setCentiSeconds();
    if (((this.remainingTime < this.warningTime) !== this.blink) && this.blink === false) {
      this.soundService.doBellSound();
    }
    this.blink = this.remainingTime < this.warningTime;
  }
  private setMinutes(): void {
    const minutes = Math.floor(this.remainingTime / 60000).toString();
    this.minutes = minutes.length < 2 ? '0' + minutes : minutes;
  }
  private setSeconds(): void {
    const seconds = Math.floor((this.remainingTime % 60000) / 1000).toString();
    this.seconds = seconds.length < 2 ? '0' + seconds : seconds;
  }
  private setCentiSeconds(): void {
    const centiseconds = ((this.remainingTime % 6000) % 1000)
      .toString()
      .substring(0, 2);
    this.centiseconds =
      centiseconds.length < 2 ? '0' + centiseconds : centiseconds;
  }
}
