import { Component, Injectable, Input, Output, EventEmitter } from "@angular/core";


type comment = {
  content: string;
  itemId: number
};
@Injectable()
@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent {
  @Input()
  itemId!: number;
  @Input()
  answerTo?: number;
  @Output("add")
  comment = new EventEmitter<comment>();
  content = "";

  //add(comment: comment): Observable<comment> {
  add() {
    this.comment.emit({
      content: this.content,
      itemId: this.itemId,
    })
  }
  
}
