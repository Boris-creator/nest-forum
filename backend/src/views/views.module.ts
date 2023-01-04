import { Module } from "@nestjs/common";
import { ItemView } from "./itemView.entity";
import { ViewsService } from "./views.service";
@Module({
  providers: [
    ViewsService,
    {
      provide: "ITEM_VIEW_REPOSITORY",
      useValue: ItemView,
    },
  ],
  exports: [ViewsService],
})
export class ViewsModule {}
