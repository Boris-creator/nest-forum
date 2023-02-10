import { Injectable } from "@nestjs/common";
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs/promises";
import { join } from "path";
import { frontend } from "./constants";

@Injectable()
export class Mult {
  async createAvatar(text: string, inputPath: string, outputPath: string) {
    const front = join(__dirname, ...frontend, "src", "assets");
    const side = 400;
    const bgPos = {
      w: side,
      h: side,
      x: 0,
      y: 0,
    };
    const canvas = createCanvas(side, side),
      ctx = canvas.getContext("2d");
    //const image = await loadImage(inputPath);
    const { w, h, x, y } = bgPos;
    //ctx.drawImage(image, x, y, w, h);
    const grad = ctx.createLinearGradient(side / 2, 0, side / 2, side);
    grad.addColorStop(0, "rgb(0, 87, 184)");
    grad.addColorStop(0.5, "rgb(0, 87, 184)");
    grad.addColorStop(0.5, "rgb(254, 221, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, side, side);
    ctx.font = "bold 200pt 'Sans'";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.textBaseline = "top";
    let metrics = ctx.measureText(text[0]);
    const xx =
        (side -
          metrics.actualBoundingBoxLeft -
          metrics.actualBoundingBoxRight) /
        2,
      yy =
        (side -
          metrics.actualBoundingBoxAscent -
          metrics.actualBoundingBoxDescent) /
        2;
    ctx.fillText(
      text[0],
      xx + metrics.actualBoundingBoxLeft,
      yy + metrics.actualBoundingBoxAscent,
    );

    const buffer = canvas.toBuffer("image/png");
    console.log(join(front, outputPath));
    await fs.writeFile(join(front, outputPath), buffer);
    return true;
  }
}
