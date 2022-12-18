import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RouterModule } from "@nestjs/core";
//import { ConfigModule } from '@nestjs/config'; //https://stackoverflow.com/a/67833695/13347427
import { ItemsModule } from "./items/items.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RaitingModule } from "./itemRaiting/raiting.module"
import {DatabaseModule} from "./db.module"
import { join } from "path";
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "frontend", "dist", "frontend"),
    }),
    //ConfigModule.forRoot({ isGlobal: true, envFilePath: "../.env" }), //I'll better use native dotenv.
    ItemsModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    RaitingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}