import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import jwt_decode from "jwt-decode";
import {userData} from "../../../src/types"
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
  //not truly network, but let it be here
  decode(): userData | null {
    const jwt = localStorage["access_token"];
    if (typeof jwt != "string") {
      return null;
    }
    return jwt_decode(jwt);
  }
}
