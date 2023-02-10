import { Module } from "@nestjs/common";
import * as SibApiV3Sdk from "sib-api-v3-sdk";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  providers: [],
  controllers: [],
  exports: [],
})
export class MailModule {
  async send({ to, subject, htmlContent }: {to:string, subject:string, htmlContent: string}) {
    const sendinblue_key = process.env.SENDINBLUE_KEY;
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      sendinblue_key;
    let data;
    try {
      data = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
        sender: { email: "noreply@" + process.env.DOMAIN, name: process.env.DOMAIN },
        subject,
        htmlContent,
        params: {
          greeting: "",
          headline: "",
        },
        messageVersions: [
          //Definition for Message Version 1
          {
            to: [
              {
                email: to,
                name: to,
              },
            ],
            htmlContent,
            subject,
          },

          // Definition for Message Version 2
          /*
              {
                to: [
                  {
                    email: to,
                    name: to,
                  },
                ],
              },
              */
        ],
      });
    } catch (err) {
      console.log(err);
    }
    console.log(data);
  }
}
