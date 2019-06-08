import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {

  @Input()
  data: string[];

  position: number = 0;

  constructor() { }

  next() {
    this.position = (this.position + 1) % this.data.length;
  }

  prev() {
    this.position = this.position === 0 ? this.data.length - 1 : this.position - 1;
  }

}
