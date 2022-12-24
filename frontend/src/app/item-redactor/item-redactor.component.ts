import { Component, Input, Output, EventEmitter } from "@angular/core";

import {
  FormGroup,
  FormBuilder,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { schema } from "@common/validationSchema";
@Component({
  selector: "app-item-redactor",
  templateUrl: "./item-redactor.component.html",
  styleUrls: ["./item-redactor.component.scss"],
})
export class ItemRedactorComponent {
  constructor(private formHelper: FormBuilder) {}

  @Output("creator")
  creator = new EventEmitter<{ title: string; body: { text: string } }>();

  @Input()
  title: string = "";

  @Input()
  text: string = "";

  form!: FormGroup;
  submit() {
    const title = this.form.controls["title"].value,
      text = this.form.controls["text"].value;
    this.creator.emit({ title, body: { text } });
  }

  ngOnInit() {
    this.form = this.formHelper.group({
      text: [
        this.text,
        {
          validators: [
            function (control: AbstractControl): ValidationErrors | null {
              const { value } = control;
              const check = schema.itemText.safeParse(value);
              return check.success == true
                ? null
                : { errors: check.error.errors[0].message };
            },
          ],
        },
      ],
      title: [
        this.title,
        {
          validators: [
            function (control: AbstractControl): ValidationErrors | null {
              const { value } = control;
              const check = schema.itemTitle.safeParse(value);
              return check.success == true
                ? null
                : { errors: check.error.errors[0].message };
            },
          ],
          //updateOn: "blur",
        },
      ],
    });
  }
}
