import { Component, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"],
})
@Injectable()
export class ItemComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}
  title!: string;
  id!: number;
  stars!: number;
  async ngOnInit() {
    this.id = +this.route.snapshot.params["id"];
    const response = await fetch("/items/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ id: this.id }),
    });
    /*
    const comment = await fetch("/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "access_token " + localStorage["access_token"],
      },
      body: JSON.stringify({ itemId: this.id, content: "Aaaaaaa!", commentId: null }),
    });
    */
    try {
      const item = await response.json();
      this.title = item.title;
    } catch (err) {}
  }
  async estimate(value: number) {
    this.stars = value;
    const response = await fetch("/estimate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "access_token " + localStorage["access_token"],
      },
      body: JSON.stringify({ itemId: this.id, value: this.stars }),
    });
  }
  goBack() {
    this.route.queryParams.subscribe((params) => {
      const page = +params["from"] || 0;
      this.router.navigate(
        ["/items"],
        page == 0 ? {} : { queryParams: { page } },
      );
    });
  }
}
