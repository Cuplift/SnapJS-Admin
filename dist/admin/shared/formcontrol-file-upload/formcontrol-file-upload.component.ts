import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { File } from './file';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-formcontrol-file-upload',
  template: `
    <div [formGroup]="form" class="row">

      <!-- Images -->
      <div *ngIf="!isMultiple">
        <label class="col-sm-2 control-label">{{displayName}}:</label>

        <div *ngIf="form.controls[field].value">
          <div *ngIf="form.controls[field].value.url">
            <img *ngIf="isImage(form.controls[field].value.type)" src="{{constants.AWS_S3_BASE_URL}}/{{form.controls[field].value.url}}"
              style="max-width: 200px; max-height: 200px;">
            <a *ngIf="!isImage(form.controls[field].value.type)" href="{{constants.AWS_S3_BASE_URL}}/{{form.controls[field].value.url}}"
              target="_blank">{{form.controls[field].value.name}}</a>
          </div>
        </div>

        <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
          <span *ngIf="form.value[field].name" (click)="form.value[field] = {}">Remove</span>
        </div>
      </div>

      <!-- Multiple images -->
      <div *ngIf="isMultiple">
        <div [formArrayName]="field">
          <label for="name" class="col-sm-2 control-label">{{field}}:</label>
          <div *ngIf="form.controls[field]" class="col-sm-10">
            <div *ngFor="let item of form.controls[field].controls; let i = index; ">
              <div *ngIf="item.controls.url">
                <img *ngIf="isImage(item.controls.type.value)" src="{{constants.AWS_S3_BASE_URL}}/{{item.controls.url.value}}"
                  style="max-width: 200px; max-height: 200px;">
                <a *ngIf="!isImage(item.controls.type.value)" href="{{constants.AWS_S3_BASE_URL}}/{{item.controls.url.value}}"
                  target="_blank">{{item.controls.name.value}}</a>

                <!-- Remove -->
                <p (click)="removeItem(i, field)">Remove</p>
              </div>
              <div [formGroupName]="i"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload form -->
      <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
        <input type="file" ng2FileSelect [uploader]="uploader" multiple="isMultiple" />
        <p *ngIf="errorMessage">{{errorMessage}}</p>
      </div>

      <!-- Display uploaded image and progress -->
      <div *ngFor="let item of uploader.queue" class="col-sm-offset-2 col-sm-10">
        <div *ngIf="!item.isSuccess">
          <p>{{item.file.name}}</p>

          <progress-bar [progress]=item.progress></progress-bar>
          Progress: {{item.progress}}%

          <p *ngIf="item.isUploading">Uploading</p>
          <p *ngIf="item.isSuccess">Uploaded</p>
          <p *ngIf="item.isError">Error</p>
        </div>
      </div>

      <!-- Upload button -->
      <div class="col-sm-offset-2 col-sm-10" *ngIf="!form.controls[field].disabled">
        <button type="button" class="btn btn-success btn-s" (click)="upload()" [disabled]="isSubmitting || !uploader.getNotUploadedItems().length">
          <span class="glyphicon glyphicon-upload"></span> Upload
        </button>
      </div>

    </div>
  `,
  styles: [`
    .my-drop-zone{border:dotted 3px lightgray}.nv-file-over{border:dotted 3px red}
  `],
})
export class FormControlFileUploadComponent implements OnInit {
  @Input() public isMultiple: boolean;
  @Input() public form: any;
  @Input() public field: string;
  @Input() public displayName: string;
  @Input() public object: {};
  @Input() public allowedMimeType?: string[];
  @Input() public maxFileSize?: number;
  public isSubmitting: boolean;
  public files: File[] = [];
  public errorMessage: string;
  public uploader: FileUploader;
  public directUpload: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private constants: ConstantsService,
  ) {}

  public ngOnInit(): void {
    // Create uploader instance with options
    // Options are here...
    // tslint:disable-next-line:max-line-length
    // https://github.com/valor-software/ng2-file-upload/blob/master/components/file-upload/file-uploader.class.ts
    this.isSubmitting = false;
    this.uploader = new FileUploader({
      url: `${this.constants.API_BASE_URL}/aws/uploadToAws`,
      method: 'PUT',
      allowedMimeType: this.allowedMimeType ||
       this.constants.FILE_UPLOAD_DEFAULT_ALLOWED_MIME_TYPES,
      maxFileSize: this.maxFileSize || this.constants.FILE_UPLOAD_DEFAULT_MAX_FILE_SIZE,
    });

    this.uploader.onAfterAddingFile = (file) => {
      // here we are checking if the file size is larger than 100 Mb = 100000000
      if (file.file.size > 100000000) {
        this.directUpload = true;
      }
      // Add withCredentials = false to avoid CORS issues
      file.withCredentials = false;
     };

    // Trigger change detection on progress update to update UI
    this.uploader.onProgressItem = (item, progress) => {
      this.changeDetectorRef.detectChanges();
    };

    // Returns the file object once it's been uploaded
    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      this.isSubmitting = false;
      if (this.directUpload) {
        const fileObject = {
          name: item.file.name,
          type: item.file.type,
          size: item.file.size,
          url: item.url
        };
        this.form.get(this.field).setValue(fileObject);
      } else {
        const file = JSON.parse(response);
        if (this.isMultiple) {
          // Add item to the FormArray
          this.addItem(file);

        } else {
          // Update the form with the new file
          this.form.get(this.field).setValue(file);
        }
      }
    };

    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      console.error('File error:', item, filter, options);
      this.isSubmitting = false;
      switch (filter.name) {
        case 'mimeType':
          const allowedMimeTypes = this.allowedMimeType.join(', ');
          this.errorMessage =
            `That file is the wrong type. Accepted file types are ${allowedMimeTypes}`;
          break;
        case 'fileSize':
          this.errorMessage = 'That file is too big.';
          break;
        default:
          this.errorMessage = 'That file cannot be uploaded.';
          break;
      }
    };

    // Add all of the files / images from the object
    if (this.object[this.field]) {
      if (this.object[this.field].constructor === Array) {
        this.object[this.field].forEach((item) => {
          this.addItem(item);
        });
      }
    }
  }

  public upload() {
    this.isSubmitting = true;
    if (this.directUpload) {

      this.getSignedRequest(this.uploader.getNotUploadedItems()[0]);
    } else {
      this.uploader.uploadAll();
    }
  }

  public getSignedRequest(fileLikeObject) {
    fileLikeObject.file.name = fileLikeObject.file.name
      .replace(/[^a-zA-Z0-9. ]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[ ]/g, '-');
    const xhr = new XMLHttpRequest();
    // include http://localhost:3000 when using locally
    // tslint:disable-next-line:max-line-length
    xhr.open('GET', `/api/aws/s3Signature?fileName=${fileLikeObject.file.name}&fileType=${fileLikeObject.file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(fileLikeObject, response.s3Signature, response.url);
        } else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  public uploadFile(fileLikeObject, s3Signature, url) {
    this.uploader.setOptions({
      disableMultipart: true,
      url: s3Signature,
      allowedMimeType: this.allowedMimeType ||
       this.constants.FILE_UPLOAD_DEFAULT_ALLOWED_MIME_TYPES,
      maxFileSize: this.maxFileSize || this.constants.FILE_UPLOAD_DEFAULT_MAX_FILE_SIZE,
    });
    this.uploader.uploadAll();
    // setting the url to the returned url so we can set it in the db
    fileLikeObject.url = url;

  }

  public addItem(item: any = {}) {
    const control = this.form.get(this.field) as FormArray;
    control.push(this.initItem(item));
  }

  public initItem(item: any = {}) {
    const formGroup = this.formBuilder.group({});
    const fileKeys = Object.keys(item);

    fileKeys.forEach((key) => {
      formGroup.registerControl(key, new FormControl(item[key] || ''));
    });

    return formGroup;
  }

  public removeItem(i: number) {
    const control = this.form.get(this.field) as FormArray;
    control.removeAt(i);
  }

  public isImage(mimeType: string) {
    return this.constants.IMAGE_MIME_TYPES.indexOf(mimeType) >= 0;
  }

}
