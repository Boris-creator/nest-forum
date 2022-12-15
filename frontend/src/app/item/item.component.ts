import { Component, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"],
})
@Injectable()
export class ItemComponent {
  constructor(private route: ActivatedRoute) {}
  title!: string;
  id!: number;
  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.title = ["A", "B"][this.id];
  }
  async estimate() {
    const response = await fetch("/estimate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ userId: 1, itemId: this.id, value: 3 }),
    });
  }
}
