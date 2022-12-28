import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import { join } from "path";
import { frontend } from "./constants";
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TO DO: move to a separate module
  try {
    await fs.mkdir(join(__dirname, ...frontend, "src", "assets", "avatars"));
  } catch {}
  await app.listen(process.env.PORT);
  console.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
