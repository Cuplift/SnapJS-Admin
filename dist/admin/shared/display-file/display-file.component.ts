import { Component, Input } from '@angular/core';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-display-file',
  template: `
    <div class="col-sm-11">
      <div *ngFor="let file of files">
        <div *ngIf="isImage(file.type)" class="array-img">
          <img *ngIf="file.styles" src="{{constants.AWS_S3_BASE_URL}}/{{file.styles.thumb_square}}" style="width: 100%">
          <img *ngIf="!file.styles" src="{{constants.AWS_S3_BASE_URL}}/{{file.url}}" style="width: 100%">
        </div>

        <div *ngIf="!isImage(file.type)">
          <span *ngIf="file.name && file.url" class="text-wordwrap"><strong>Name:</strong> <a href="{{constants.AWS_S3_BASE_URL}}/{{file.url}}"
              target="_blank">{{file.name}}</a></span>
          <br>
          <span *ngIf="file.type" class="text-wordwrap"><strong>Type:</strong> {{file.type}}</span>
          <br>
          <span *ngIf="file.size" class="text-wordwrap"><strong>size: </strong> {{file.size}}</span>
          <br>
          <br>
          <span *ngIf="file.status" class="text-wordwrap"><strong>status: </strong> {{file.status}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .array-img{display:inline-block;width:85px;height:85px;overflow:hidden;margin-right:5px}
  `],
})
export class DisplayFileComponent {
  @Input() files: any[];

  constructor(
    private constants: ConstantsService,
  ) {}

  isImage(mimeType: string) {
    return this.constants.IMAGE_MIME_TYPES.indexOf(mimeType) >= 0;
  }
}
