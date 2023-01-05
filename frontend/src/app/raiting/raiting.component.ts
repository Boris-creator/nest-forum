import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-raiting',
  templateUrl: './raiting.component.html',
  styleUrls: ['./raiting.component.scss'],
})
export class RaitingComponent {
  @Input()
  max!: number;
  @Input()
  raiting!: number;
  @Input()
  previous!: number;
  @Output()
  mark = new EventEmitter<number>();

  get stars() {
    return [...Array(this.max)].map((_, i) => i);
  }
  get ceil() {
    return Math.ceil(this.raiting);
  }
  estimate(value: number) {
    this.mark.emit(value);
  }
}
