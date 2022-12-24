import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./notifications.entity";
@Module({
  providers: [
    NotificationsService,
    {
      provide: "NOTIFY_REPOSITORY",
      useValue: Notification,
    },
  ],
})
export class NotificationsModule {}
