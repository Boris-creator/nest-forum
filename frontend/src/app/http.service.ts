import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
@Injectable()
export class HttpHelper {
  get options() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "access_token " + localStorage["access_token"],
      }),
    };
  }
}
