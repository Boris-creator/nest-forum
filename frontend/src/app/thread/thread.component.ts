import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
} from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpHelper } from "../http.service";
import { Helper } from "../permissions.service";

import { comment as comment_, newComment, editComment } from "@common/types";
import { editCommentMaxTime } from "@common/constants";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

type comment = comment_ & { answerTo?: comment };
type search = {
  itemId: number;
};
@Component({
  selector: "app-thread",
  templateUrl: "./thread.component.html",
  styleUrls: ["./thread.component.scss"],
})
export class ThreadComponent {
  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelper,
    private rolesHelper: Helper
  ) {}
  @ViewChild("commentsContainer")
  block!: ElementRef;
  @Input()
  itemId!: number;

  comments: comment[] = [
    /*
    {
      id: 1,
      itemId: 1,
      userId: 1,
      author: {
        login: "Boris",
      },
      content: "Test content",
      commentId: null,
      createdAt: new Date(),
    },
    */
  ];
  commentToAnswer?: comment | null;
  commentToEdit: number | null = null;
  private events = new EventEmitter();
  get comments_permissions() {
    const user = this.rolesHelper.decode();
    const delete_comments = user.canDeleteComments();
    return Object.fromEntries(
      this.comments.map((comment) => {
        return [
          comment.id,
          {
            edit:
              delete_comments ||
              (user.id == comment.userId &&
                Date.now() - +new Date(comment.createdAt) < editCommentMaxTime),
            del: delete_comments,
          },
        ];
      })
    );
  }
  private urlPrefix = "comment";
  private urls = {
    add: this.urlPrefix + "/add",
    edit: this.urlPrefix + "/edit",
    getAll: this.urlPrefix + "/find",
    deleteOne: this.urlPrefix + "/delete",
  };
  private httpOptions = this.httpHelper.options;
  private errorMessages: { [key: number]: string } = {
    400: "Your message is too short",
    403: "Log in if you want to post your comments",
  };
  errorMessage: string | null = null;
  private transformUtil =
    (comments: comment[]) =>
    (comment: comment): comment_ => {
      const res = { ...comment, createdAt: new Date(comment.createdAt) };
      if (comment.commentId) {
        res.answerTo = comments.find((c) => c.id == comment.commentId);
      }
      return res;
    };

  answerTo(comment: comment | null) {
    this.commentToAnswer = comment;
    this.events.emit("answer");
  }
  navigateTo(commentId: number) {
    //scroll to the comment
    this.block.nativeElement
      .querySelector("#comment-" + commentId)
      ?.scrollIntoView();
  }
  addComment(comment: { content: string }) {
    const newComment: newComment = {
      content: comment.content,
      itemId: this.itemId,
      commentId: this.commentToAnswer?.id || null,
    };
    const req: Observable<comment> = this.http
      .post<comment>(this.urls.add, newComment, this.httpOptions)
      .pipe(map(this.transformUtil(this.comments)));
    req.subscribe({
      next: (res) => {
        this.comments.push(res);
        this.events.emit("add");
      },
      error: (err) => {
        this.errorMessage = this.errorMessages[err.status] || null;
      },
    });
  }
  editComment(comment: editComment) {
    const req: Observable<any> = this.http
      .post<any>(this.urls.edit, comment, this.httpOptions)
      .pipe();
    req.subscribe({
      next: (res) => {
        const c = this.comments.find(({ id }) => id == comment.id);
        c && (c.content = comment.content);
        this.commentToEdit = null;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getComments() {
    const req: Observable<comment[]> = this.http
      .post<comment[]>(
        this.urls.getAll,
        { itemId: this.itemId } as search,
        this.httpOptions
      )
      .pipe(map((comments) => comments.map(this.transformUtil(comments))));
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
      this.httpOptions
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
    this.events.subscribe({
      next: (e: string) => {
        const block = this.block.nativeElement;
        if (e == "add") {
          requestAnimationFrame(() => {
            block.querySelector(".comment:last-child").scrollIntoView({
              behavior: "smooth",
            });
            return;
            //or;
            window.scrollTo({
              top: block.getBoundingClientRect().top + block.offsetHeight,
              left: 0,
              behavior: "smooth",
            });
          });
        }
        if (e == "answer") {
          //block.querySelector()
        }
      },
    });
  }
}
