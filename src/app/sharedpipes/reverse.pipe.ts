import { Pipe, PipeTransform } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any[], reverse: boolean): any {
    return reverse ? Object.assign([], value).reverse() : value;
  }

}
