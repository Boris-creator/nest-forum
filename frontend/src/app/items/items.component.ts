import { Component, Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  queryOptions as options,
  itemsInfo as info,
} from "../../../../src/types";

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
  constructor(private router: Router, private route: ActivatedRoute) {}
  items: item[] = [
    { id: 1, title: "First A" },
    { id: 2, title: "First B" },
    { id: 3, title: "First C" },
  ];
  count = 0;
  private itemsPerPage = 4;
  private page_!: number;
  private cache = new Map<number, item[]>();
  private get offset() {
    return this.page * this.itemsPerPage;
  }
  get page() {
    return this.page_;
  }
  set page(page) {
    this.page_ = page;
    this.router.navigate(page == 0 ? ["/items"] : ["/items", page + 1]); //I can add an if condition, checking if we are on the page already
    if (this.cache.has(page)) {
      this.setItems(this.cache.get(page) || [], this.count);
      return;
    }
    this.getItems().then(({ items, count }) => {
      this.setItems(items, count);
      this.cache.set(page, items);
    });
  }
  get lastPage() {
    return this.count <= this.offset + this.itemsPerPage;
  }
  get pagesCount() {
    return Math.ceil(this.count / this.itemsPerPage);
  }
  openItem(itemId: number) {
    this.router.navigate(["/item", itemId], {
      queryParams: { from: this.page + 1 },
    });
  }
  async getItems(): Promise<info<item>> {
    const response = await fetch("/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        limit: this.itemsPerPage,
        offset: this.offset,
      } as options),
    });
    if (response.ok) {
      return await response.json();
    }
    return { count: 0, items: [] };
  }
  setItems(items: item[], count: number) {
    this.items.splice(0, this.items.length, ...items);
    this.count = count;
  }
  async ngOnInit() {
    const page = +this.route.snapshot.params["page"] - 1 || 0;
    this.page = Math.max(page, 0);
  }
}
