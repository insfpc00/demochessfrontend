import { Pipe, PipeTransform } from '@angular/core';
import { TimeControlled } from '../model/timecontrolled.model';

export const timeControlTypes = {
  blitz: 'blitz',
  rapid: 'rapid',
  bullet: 'bullet'
};

@Pipe({ name: 'timeControlType' })
export class TimeControlTypePipe implements PipeTransform {
  transform(timeControlled: TimeControlled) {
    if (timeControlled.timeInSeconds >= 600) {
      return timeControlTypes.rapid;
    } else if (timeControlled.timeInSeconds >= 180) {
      return timeControlTypes.blitz;
    } else {
      return timeControlTypes.bullet;
    }
  }
}

@Pipe({ name: 'timeControl' })
export class TimeControlPipe implements PipeTransform {
  transform(timeControlled: TimeControlled) {
    let result =
      timeControlled.timeInSeconds >= 60
        ? timeControlled.timeInSeconds / 60 + ' m'
        : timeControlled.timeInSeconds + ' s';
    result += ' + ' + timeControlled.timeIncrementInSeconds + ' s';
    return result;
  }
}

