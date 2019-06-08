import { Injectable } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ClockService {

 clock: Observable <number>;

 constructor() {
    this.clock = timer(0, 100).pipe(map(t => (new Date()).getTime()), shareReplay(1));
  }

 getTime(): Observable<number>{
  return this.clock;
 }

}
