import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { HttpHelper } from "../http.service";
import { comment } from "../../../../src/types";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";

type newComment = {
  content: string;
  itemId: number;
};
type search = {
  itemId: number;
};
@Component({
  selector: "app-thread",
  templateUrl: "./thread.component.html",
  styleUrls: ["./thread.component.scss"],
})
export class ThreadComponent {
  constructor(private http: HttpClient, private httpHelper: HttpHelper) {}

  @Input()
  itemId!: number;
  comments: comment[] = [];
  private urls = {
    add: "comment/add",
    getAll: "comment/find",
  };
  private httpOptions = this.httpHelper.options;
  addComment(comment: newComment) {
    const req: Observable<comment> = this.http
      .post<comment>(this.urls.add, comment, this.httpOptions)
      .pipe();
    req.subscribe((res) => {
      this.comments.push(res);
    });
  }
  getComments() {
    const req: Observable<comment[]> = this.http
      .post<comment[]>(
        this.urls.getAll,
        { itemId: this.itemId } as search,
        this.httpOptions,
      )
      .pipe();
    req.subscribe((data) => {
      this.comments.splice(0, this.comments.length, ...data);
    });
  }
  ngOnInit() {
    this.getComments();
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
  }
}
