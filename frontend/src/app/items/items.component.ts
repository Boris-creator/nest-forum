import { Component, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHelper } from '../http.service';
import { Helper } from '../permissions.service';
import { HttpClient } from '@angular/common/http';
import {
  queryOptions as options,
  itemsInfo as info,
  item as newItem,
} from '@common/types';
import { first } from 'rxjs';

type item = newItem & { id: number, author?: {login: string} };
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
@Injectable()
export class ItemsComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private httpHelper: HttpHelper,
    private rolesHelper: Helper
  ) {}
  items: item[] = [
    { id: 1, title: 'First A', approved: true, userId: 1, body: { text: '' } },
    { id: 2, title: 'First B', approved: true, body: { text: '' } },
    { id: 3, title: 'First C', approved: true, body: { text: '' } },
  ];
  count = 3;
  filters: options['filter'] = {};

  refresh = {};
  dataLoaded = false;
  editorOpen = false;

  applyFilters(e: Event) {
    const elem = e.target as HTMLInputElement;
    const v = elem.value;
    switch (v) {
      case 'all':
        delete this.filters['approved'];
        break;
      case 'approved':
        this.filters['approved'] = true;
        break;
      case 'not':
        this.filters['approved'] = false;
    }
    this.refresh = {};
    return v;
  }
  get moder() {
    return this.rolesHelper.decode().canAddItems();
  }
  private httpOptions = this.httpHelper.options;
  openItem(itemId: number) {
    this.route.queryParams.subscribe((params) => {
      this.router.navigate(['/item', itemId], {
        queryParams: { from: params['page'] },
      });
    });
  }
  feed(items: item[]) {
    this.setItems(items, this.count);
  }
  async demand({ limit, offset }: { offset: number; limit: number }) {
    const options: options = {
      limit,
      offset,
      filter: this.filters,
    };
    let res = { count: 0, items: this.items };
    this.dataLoaded = false;
    const response = await fetch('/items', {
      //to do: use http
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'access_token ' + localStorage['access_token'],
      },
      body: JSON.stringify(options),
    });
    if (response.ok) {
      res = await response.json();
      this.setItems(res.items, res.count);
      this.dataLoaded = true;
    }
  }
  private setItems(items: item[], count: number) {
    this.items.splice(0, this.items.length, ...items);
    this.count = count;
  }
  addItem(item: { title: string; body: { text: string } }) {
    this.http.post<any>('items/create', item, this.httpOptions).subscribe({
      next: (item: item) => {
        this.editorOpen = false;
        if (item.approved) {
          this.items.push(item);
          this.count++;
        }
      },
      error() {
        console.log('Something is wrong...');
      },
    });
  }
  approveItem(item: item) {
    this.http
      .post<any>(
        'items/approve',
        { id: item.id, approve: true },
        this.httpOptions
      )
      .subscribe(() => {
        item.approved = true;
      });
  }
  async ngOnInit() {
    this.route.queryParams.pipe(first()).subscribe((params) => {
      for (let key in params) {
        if (key != 'page') {
          this.filters[key] = params[key];
        }
      }
    });
  }
}
