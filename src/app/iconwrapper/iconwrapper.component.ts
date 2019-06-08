import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'icon-wrapper',
  templateUrl: './iconwrapper.component.html',
  styleUrls: ['./iconwrapper.component.css']
})
export class IconwrapperComponent implements OnInit {
  @Input() name: string;
  @Input() color?: string;
  @Input() size?: number;

  iconsMap = {
    bullet: ['lightning', 'grey', 'Bullet'],
    blitz: ['flame', 'grey' , 'Blitz'],
    rapid: ['rabbit', 'grey' , 'Rapid'],
    win: ['thumbsup', 'silver' , 'Win'],
    loss: ['thumbsdown', 'silver', 'Loss'],
    draw: ['handshake', 'silver', 'Draw'],
    puzzle: ['puzzle', 'grey', '']
  };

  constructor() { }

  ngOnInit() {
    if (!this.color) {this.color = this.iconsMap[this.name][1]; }
    if (!this.size) {this.size = 2;}
  }

}
