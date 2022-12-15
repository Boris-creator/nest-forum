import { Component, Injectable } from "@angular/core";
import { Router } from "@angular/router";

type item = {
  id: number;
  title: string;
};
@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
@Injectable()
export class ItemsComponent {
  constructor(private router: Router) {}
  items: item[] = [
    { id: 1, title: "First A" },
    { id: 2, title: "First B" },
    { id: 3, title: "First C" },
  ];
  openItem(itemId: number) {
    this.router.navigate(["/item", itemId]);
  }
  async ngOnInit() {
    const response = await fetch("/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({}),
    });
    if (response.ok) {
      this.items.splice(0, this.items.length, ...(await response.json()));
    }
  }
}
