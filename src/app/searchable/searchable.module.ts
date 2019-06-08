import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableDirective } from './searchable.directive';

@NgModule({
  declarations: [SearchableDirective],
  imports: [
    CommonModule
  ],
  exports: [
    SearchableDirective
  ]
})
export class SearchableModule { }
