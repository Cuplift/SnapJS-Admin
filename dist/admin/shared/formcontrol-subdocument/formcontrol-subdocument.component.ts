import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formcontrol-subdocument',
  template: `
    <div class="form-group">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div class="col-sm-10">
        {{value}}
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolSubdocumentComponent {
  @Input() displayName: string;
  @Input() value: string;
}
