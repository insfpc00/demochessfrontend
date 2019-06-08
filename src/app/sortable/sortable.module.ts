import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbdSortableHeader } from './sortable.directive';

@NgModule({
  declarations: [NgbdSortableHeader],
  imports: [
    CommonModule
  ],
  exports: [
    NgbdSortableHeader
  ]
})
export class SortableModule { }
