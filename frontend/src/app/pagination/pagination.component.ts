import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { queryOptions as options, itemsInfo as info } from "@common/types";
import { first } from "rxjs";

type item = {
  id: number;
  title: string;
};

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
@Injectable()
export class PaginationComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  @Input()
  items: item[] = [
    { id: 1, title: "First A" },
    { id: 2, title: "First B" },
    { id: 3, title: "First C" },
  ];
  @Input()
  count = 0;

  @Input()
  filters: options["filter"] = {};

  @Input()
  refresh!: {};

  @Input()
  dataLoaded = false;

  @Output("demand")
  demand = new EventEmitter<any>();

  @Output("feed")
  feed = new EventEmitter<any>();

  private itemsPerPage = 4;
  private page_!: number;
  private pagesToShow = 3;
  private cache = new Map<number, item[]>();
  private get offset() {
    return this.page * this.itemsPerPage;
  }
  get page() {
    return this.page_;
  }
  set page(page) {
    this.page_ = page;
    //this.router.navigate(page == 0 ? ["/items"] : ["/items", page + 1]); //In this case router resets the component's state, :(
    const queryParams = { ...this.filters };
    if (page != 0) {
      queryParams["page"] = page + 1;
    }
    this.router.navigate(["/items"], { queryParams });
    if (this.cache.has(page)) {
      this.feed.emit(this.cache.get(page));
      return;
    }
    this.demand.emit({ offset: this.offset, limit: this.itemsPerPage });
  }
  get lastPage() {
    return this.count <= this.offset + this.itemsPerPage;
  }
  get pages() {
    const { count, page, pagesToShow, itemsPerPage } = this;
    const pagesTotal = Math.ceil(count / itemsPerPage);
    const pagesCount = Math.min(pagesToShow, pagesTotal);
    const pad = (pagesToShow - 1) / 2;
    const minPage = Math.min(Math.max(0, page - pad), pagesTotal - pagesToShow);
    return [...Array(pagesCount)].map((_, i) => i + minPage);
  }

  async getItems(): Promise<info<item>> {
    return { count: 0, items: [] };
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["dataLoaded"]?.currentValue == true) {
      this.cache.set(this.page, [...this.items]);
    }
    if (changes["refresh"]) {
      this.cache.clear();
      this.page = 0;
    }
  }
  ngOnInit() {
    //const page = +this.route.snapshot.params["page"] - 1 || 0;
    this.route.queryParams.pipe(first()).subscribe((params) => {
      const page = (+params["page"] || 1) - 1;
      this.page = Math.max(page, 0);
    });
  }
}
