import { Component } from '@angular/core';
import { Helper } from '../permissions.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  constructor(private helper: Helper) {}
  userId!: number;
  ngOnInit() {
    this.helper.decode();
    if (this.helper.id) this.userId = this.helper.id;
  }
}
