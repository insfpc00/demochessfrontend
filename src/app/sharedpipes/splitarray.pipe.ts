import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitarray'
})
export class SplitarrayPipe implements PipeTransform {

  transform(arr: any[], rows: number): [][] {
    const result = new Array(rows).fill([]);

    result.forEach((_, i) => result[i] = arr.filter((__, j) => j % rows === i));
    return result;

  }

}
