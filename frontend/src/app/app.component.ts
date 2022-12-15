import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  async ngOnInit() {
    return
      const response = await (
        await fetch("/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({ username: "Stepan" }),
        })
      ).json();
      console.log(response);
    ;
  }
}
