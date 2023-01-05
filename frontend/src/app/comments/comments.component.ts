import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { schema } from "@common/validationSchema";
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
  @Output("cancel")
  escape = new EventEmitter();
  @ViewChild("input")
  input!: ElementRef;

  get valid() {
    return schema.commentContent.safeParse(this.content).success;
  }

  //add(comment: comment): Observable<comment> {
  add() {
    if (!this.valid) {
      return;
    }
    this.comment.emit({
      content: this.content,
    });
    this.clear();
  }
  cancel() {
    this.escape.emit();
    this.clear();
  }
  clear() {
    this.content = "";
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["answerTo"] && changes["answerTo"].currentValue) {
      this.input.nativeElement.focus();
    }
  }
}
