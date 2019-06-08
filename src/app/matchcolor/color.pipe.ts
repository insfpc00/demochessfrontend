import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'matchColor' })
export class MatchColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(color:string): SafeHtml {
    let result;
    switch( color ){
      case 'white':
      result = '<span class="text-light shadowed-dark">&#9812; &#9813; &#9814; &#9815; &#9816;&#9817;</span>';
      break;
      case 'black':
      result = '<span class="text-dark shadowed-light">&#9818; &#9819; &#9820; &#9821; &#9822;&#9823;</span>';
      break;
      case 'random':
      result = '<span class="text-light shadowed-dark">&#9812; &#9813; || </span> <span class="text-dark shadowed-light">&#9818;&#9819;</span>'
    }
      return this.sanitizer.bypassSecurityTrustHtml( result);
    }

  }

