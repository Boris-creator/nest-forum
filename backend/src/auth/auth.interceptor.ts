import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Helper } from "./auth.helper";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private transformer: Helper) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      this.transformer.transform(context);
    } catch (error) {}
    return next.handle();
  }
}
