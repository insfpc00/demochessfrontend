import { Directive, EventEmitter, Output, HostListener, Input } from '@angular/core';

export interface SearchEvent {
  key: string;
  term: string;
}

@Directive({
  selector: '[searchable]'
})
export class SearchableDirective {

  @Output() search = new EventEmitter<SearchEvent>();
  @Input() searchable: string;
  @HostListener('change', ['$event']) onChange(event): void {
    this.search.emit({key: this.searchable, term: event.srcElement.value});
  }

  constructor() { }
}

