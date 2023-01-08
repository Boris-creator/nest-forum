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
import { codes as errorCodes } from "@common/errorCodes";
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

  comments: comment[] = [];
  commentToAnswer?: comment | null;
  commentToEdit: number | null = null;
  commentSaved!: boolean;
  editSaved!: boolean;
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

  errors: {
    add: { type: number; data?: any } | null;
    edit: { type: number; data?: any } | null;
  } = {
    add: null,
    edit: null,
  };
  get errorMessages() {
    const { add, edit } = this.errors;
    return {
      add: add
        ? {
            1: "You have not rights to add comments.",
            2: "Your comment is too short",
            3: `Some of your files has wrong format: ${add.data?.files.join(
              ", "
            )}`,
          }[add.type]
        : "",
      edit: edit
        ? {
            1: "You have not rights to edit the comment.",
            2: "Your comment is too short",
          }[edit.type]
        : "",
    };
  }
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
  addComment(comment: { content: string; files?: File[] }) {
    const newComment: newComment = {
      content: comment.content,
      itemId: this.itemId,
      commentId: this.commentToAnswer?.id || null,
    };
    const fData = new FormData();
    fData.append("comment", JSON.stringify(newComment));
    if (comment.files) {
      comment.files.forEach((file, i) => {
        fData.append(`file_${i}`, file);
      });
    }
    const req: Observable<comment> = this.http
      .post<comment>(this.urls.add, fData, {
        headers: this.httpOptions.multiHeaders,
      })
      .pipe(map(this.transformUtil(this.comments)));
    this.commentSaved = false;
    req.subscribe({
      next: (res) => {
        this.comments.push(res);
        this.events.emit("add");
      },
      error: (err) => {
        if (err.status == 403) {
          this.errors.add = { type: 1 };
        }
        if (err.status == 400) {
          if (err.error.code == errorCodes.FILE_FORMAT_ERR) {
            this.errors.add = { type: 3, data: err.error };
          }
          if (err.error.code == errorCodes.FORMAT_ERR) {
            this.errors.add = { type: 2 };
          }
        }
      },
    });
  }
  editComment(comment: editComment) {
    const req: Observable<any> = this.http
      .post<any>(this.urls.edit, comment, this.httpOptions)
      .pipe();
    this.editSaved = false;
    req.subscribe({
      next: (res) => {
        const c = this.comments.find(({ id }) => id == comment.id);
        c && (c.content = comment.content);
        this.commentToEdit = null;
        this.editSaved = true;
      },
      error: (err) => {
        this.errors.edit = { type: err.status == 403 ? 1 : 2 };
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
  cancelEdit() {
    this.commentToEdit = null;
    this.events.emit("cancelEdit");
  }
  ngOnInit() {
    this.getComments();
    this.events.subscribe({
      next: (e: string) => {
        const block = this.block.nativeElement;
        if (e == "add") {
          this.commentSaved = true;
          this.errors.add = null;
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
        if (e == "cancelEdit") {
          this.errors.edit = null;
        }
      },
    });
  }
}
