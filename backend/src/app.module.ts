import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
//import { ConfigModule } from '@nestjs/config'; //https://stackoverflow.com/a/67833695/13347427
import { ItemsModule } from "./items/items.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RaitingModule } from "./itemRaiting/raiting.module";
import { DatabaseModule } from "./db.module";
import { join } from "path";
import { CommentsModule } from "./comments/comments.module";
import { RolesModule } from "./roles/roles.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { frontend } from "./constants";
import { ViewsModule } from './views/views.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, ...frontend, "dist", "frontend"),
    }),
    //ConfigModule.forRoot({ isGlobal: true, envFilePath: "../.env" }), //I'll better use native dotenv.
    EventEmitterModule.forRoot(),
    ItemsModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    RaitingModule,
    CommentsModule,
    RolesModule,
    NotificationsModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
