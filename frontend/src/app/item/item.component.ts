import { Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { constants } from '@common/itemRaiting/raiting.constants';
import { HttpClient } from '@angular/common/http';
import { HttpHelper } from '../http.service';
import { Helper } from '../permissions.service';
import { userGrade } from '@common/types';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
@Injectable()
export class ItemComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private httpHelper: HttpHelper,
    private userHelper: Helper
  ) {}
  title!: string;
  id!: number;
  userId?: number;
  stars!: number;
  raiting: number = 0;
  maxRait = constants.MAX;
  async ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.userHelper.decode();
    this.userHelper.id && (this.userId = this.userHelper.id);
    //to do: use http
    const response = await fetch(`/items/item/${this.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'access_token ' + localStorage['access_token'],
      },
      //body: JSON.stringify({ id: this.id }),
    });
    try {
      const item = await response.json();
      this.title = item.title;
      this.raiting = item.raiting;
    } catch (err) {}
    if (!this.userId) {
      return;
    }
    const previous = this.http.post<userGrade>(
      '/myGrade',
      { itemId: this.id },
      this.httpHelper.options
    );
    previous.subscribe({
      next: ({ raiting }) => {
        this.stars = raiting;
      },
    });
  }
  async estimate(value: number) {
    this.stars = value;
    const req = this.http
      .post<{ raiting: number }>(
        '/estimate',
        { itemId: this.id, value: this.stars },
        this.httpHelper.options
      )
      .pipe();
    req.subscribe((res) => {
      res && (this.raiting = res.raiting);
    });
  }
  goBack() {
    this.route.queryParams.subscribe((params) => {
      const page = +params['from'] || 0;
      this.router.navigate(
        ['/items'],
        page == 0 ? {} : { queryParams: { page } }
      );
    });
  }
}
