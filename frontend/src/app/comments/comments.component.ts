import { Component, Injectable, Input, Output, EventEmitter } from "@angular/core";

export type comment = {
  content: string;
};
@Injectable()
@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent {
  //@Input()itemId!: number;
  @Input()
  answerTo?: number;
  @Input()
  content = "";
  @Output("add")
  comment = new EventEmitter<comment>();

  //add(comment: comment): Observable<comment> {
  add() {
    this.comment.emit({
      content: this.content,
    })
    this.content = ""
  }
  
}
