import { Module } from "@nestjs/common";
import { roleProviders } from "./roles.providers";
@Module({
  providers: [...roleProviders],
  exports: [...roleProviders]
})
export class RolesModule {}
