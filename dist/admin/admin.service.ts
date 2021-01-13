import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';
import { ConstantsService } from './constants.service';

@Injectable()
export class AdminService {
  className: string;
  schema: any;
  schemaKeys: string[];
  tzOffsetInHours: any;
  wysiwygSettings: any;

  constructor(
    private http: Http,
    private constants: ConstantsService,
  ) {
    // Get the user's time zone offset in hours
    const today = new Date();
    this.tzOffsetInHours = -today.getTimezoneOffset() / 60;
    this.wysiwygSettings = this.constants.ADMIN_WYSIWYG_OPTIONS;
  }

  loadSchema(): Promise<{}> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/schema`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => {
        // Set schema and merge any overwrites
        this.schema = response.json();
        this.schema = _.merge(this.schema, this.constants.DEFAULT_SCHEMA_OVERWRITES[this.className]);
        this.schemaKeys = Object.keys(this.schema);

        return this.schema;
      });
  }

  query(params: {} = {}): Promise<any> {
    let queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}?`;

    queryUrl += this.serializeParams(params).toString();

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => response.json());
  }

  importFromCsv(object) {
    let queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/importFromCsv`;
    return this.http.post(queryUrl, object)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  getById(id: string): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${id}`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  update(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${object._id}`;

    return this.http.put(queryUrl, object)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  create(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}`;

    return this.http.post(queryUrl, object)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  delete(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${object._id}`;

    return this.http.delete(queryUrl)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  deleteMultiple(objectIds: string[]) {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/deleteMultiple`;

    return this.http.post(queryUrl, { ids: objectIds })
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  search(className: string, search: string, field: string = 'name', params: any = { limit: 10 }): Promise<any> {
    let queryUrl = `${this.constants.API_BASE_URL}/admin/${className}`;

    queryUrl += `?${this.serializeParams(params).toString()}`;

    queryUrl += `&filters[0][field]=${field}&filters[0][operator]=like&filters[0][value]=${search}`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => response.json());
  }

  /**
   * Utility function to get keys from an object
   * @param {any} object any object
   */
  getKeys(object: any) {
    return Object.keys(object);
  }

  /**
   * Utility function to serialize params
   * @param {any} object params object
   */
  serializeParams(params: any) {
    const serializedParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        serializedParams.set(key, params[key]);
      }
    }

    return serializedParams;
  }

}
