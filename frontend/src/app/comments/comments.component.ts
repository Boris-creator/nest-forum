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
  files?: File[];
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
  success!: boolean;
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

  files: File[] = [];
  previews: { src: string; file: File }[] = [];

  get valid() {
    return schema.commentContent.safeParse(this.content).success;
  }

  selectFiles(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newFiles = Array.from(input.files || []);
    for (let file of newFiles) {
      this.addFile(file);
    }
  }
  addFile(file: File) {
    this.files.push(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.previews.push({ src: reader.result as string, file });
    };
    reader.readAsDataURL(file);
  }
  pasteFile(event: ClipboardEvent) {
    const items: File[] = Array.from(event.clipboardData?.files || []);
    const file = items[0] || null;
    if (!file) {
      return;
    }
    this.addFile(file);
  }
  deleteFile(file: File) {
    const { files, previews } = this;
    files.splice(files.indexOf(file), 1);
    previews.splice(
      previews.findIndex(({ file: f }) => f == file),
      1
    );
  }
  //add(comment: comment): Observable<comment> {
  add() {
    if (!this.valid) {
      return;
    }
    this.comment.emit({
      content: this.content,
      files: this.files,
    });
    //this.clear();
  }
  cancel() {
    this.escape.emit();
    this.clear();
  }
  clear() {
    this.content = "";
    this.files.length = 0;
    this.previews.length = 0
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["answerTo"] && changes["answerTo"].currentValue) {
      this.input.nativeElement.focus();
    }
    if (changes["success"] && changes["success"].currentValue) {
      this.clear()
    }
  }
}
