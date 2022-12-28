import { Injectable, Inject } from "@nestjs/common";
import { fromEvent } from "rxjs";
import { map, filter } from "rxjs/operators";
import { OnEvent, EventEmitter2 } from "@nestjs/event-emitter";
import { Notify } from "./notifications.enum";
import { Notification } from "./notifications.entity";
@Injectable()
export class NotificationsService {
  constructor(
    private emitter: EventEmitter2,
    @Inject("NOTIFY_REPOSITORY") private bd: typeof Notification,
  ) {}
  //@OnEvent(Notify.deleteComment) //without using RxJs:
  async notify1(info: { userId: number; text: string; type: Notify }) {
    return await this.bd.create(info); // I shouldn't store a formatted string!
  }
  onModuleInit() {
    //without using RxJs:
    /*
    this.emitter.prependListener(Notify.deleteComment, () => {
      console.log(
        "Here we can collect some data to make the note more useful or format it",
      );
    });
    */
    //using RxJs:
    const t = this;
    const light = fromEvent(this.emitter, Notify.deleteComment);
    light
      .pipe(
        filter((note: any) => {
          return note.comment.userId !== note.by.id;
        }),
        map((note: any) => {
          const text = `Hi! Your shit comment "${note.comment.content.slice(
            0,
            10,
          )}" was removed by ${note.by.username}.`;
          return {
            text,
            userId: note.comment.userId,
            type: Notify.deleteComment,
          };
        }),
      )
      .subscribe({
        next(data) {
          t.notify1(data);
        },
      });
  }
}
