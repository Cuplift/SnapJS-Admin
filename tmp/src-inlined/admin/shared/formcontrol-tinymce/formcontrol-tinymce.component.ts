import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare var tinyMCE: any;
declare var tinymce: any;

@Component({
  selector: 'app-formcontrol-tinymce',
  template: `
    <div [formGroup]="form" class="form-group">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div class="col-sm-10">
        <textarea id="tinymce-{{field}}" [formControlName]="field" class="form-control"></textarea>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolTinymceComponent implements AfterViewInit, OnDestroy {
  @Input() field: string;
  @Input() displayName: string;
  @Input() form: FormGroup;
  editor: any;

  ngAfterViewInit() {
    tinyMCE.baseURL = '/assets/tinymce/';
    tinymce.init({
      selector: `#tinymce-${this.field}`,
      menubar: false,
      plugins: ['link', 'paste', 'lists', 'advlist'],
      toolbar: 'styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
      setup: (editor) => {
        this.editor = editor;

        // Update the form as the user makes changes
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.form.get(this.field).patchValue(content);
        });

        // Need the blur for events that happen without 'keyup' (e.g. adding a link)
        editor.on('blur', () => {
          const content = editor.getContent();
          this.form.get(this.field).patchValue(content);
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
