import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHelper } from "../http.service";
import { comment, newComment, userData } from "../../../../src/types";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";

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
  commentToAnswer?: number | null;
  get delete_comments() {
    const userData: userData | null = this.httpHelper.decode();
    if (!userData) {
      return false;
    }
    return userData.permissions.includes("delete_comments");
  }
  private urlPrefix = "comment";
  private urls = {
    add: this.urlPrefix + "/add",
    getAll: this.urlPrefix + "/find",
    deleteOne: this.urlPrefix + "/delete",
  };
  private httpOptions = this.httpHelper.options;
  private errorMessages: { [key: number]: string } = {
    400: "Your message is too short",
    403: "Log in if you want to post your comments",
  };
  errorMessage: string | null = null;

  answerTo(commentId: number | null) {
    this.commentToAnswer = commentId;
    //scroll to form
  }
  navigateTo(commentId: number) {
    //scroll to the comment
  }
  addComment(comment: { content: string }) {
    const newComment: newComment = {
      content: comment.content,
      itemId: this.itemId,
      commentId: this.commentToAnswer || null,
    };
    const req: Observable<comment> = this.http
      .post<comment>(this.urls.add, newComment, this.httpOptions)
      .pipe();
    req.subscribe({
      next: (res) => {
        this.comments.push(res);
      },
      error: (err) => {
        this.errorMessage = this.errorMessages[err.status] || null;
      },
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
    req.subscribe({
      next: (data) => {
        this.comments.splice(0, this.comments.length, ...data);
      },
    });
  }
  deleteComment(commentId: number) {
    const req = this.http.post<{ success: boolean }>(
      this.urls.deleteOne,
      { id: commentId },
      this.httpOptions,
    );
    req.subscribe({
      next: () => {
        const i = this.comments.findIndex(({ id }) => id == commentId);
        if (i == -1) {
          return;
        }
        this.comments.splice(i, 1);
      },
    });
  }
  ngOnInit() {
    this.getComments();
  }
}
