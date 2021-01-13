import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  operators: any;

  constructor() {
    this.operators = {
      String: ['equals', 'not equal', 'like'],
      Number: ['equals', 'not equal', 'less than', 'greater than',
               'less than or equal to', 'greater than or equal to'],
      Boolean: ['true', 'false'],
      Date: ['less than', 'greater than', 'less than or equal to', 'greater than or equal to'],
      ObjectID: ['equals', 'not equal', 'like'],
      Image: ['equals', 'not equal', 'like'],
      Array: ['equals', 'not equal', 'like']
    };
  }

  buildQuery(filters: any, itemsPerPage: number, skip: number, sort: string) {
    let query = { limit: itemsPerPage, skip: skip, sort: sort };

    filters.forEach((filter, index) => {
      // Build the query object so the server receives an array of filter objects
      query[`filters[${index}][field]`] = filter.field;
      query[`filters[${index}][operator]`] = filter.operator;
      query[`filters[${index}][value]`] = filter.value;
    });

    return query;
  }

  buildFilter(field: string, operator: string, value: string) {
    return { field: field, operator: operator, value: value };
  }

  // Check if the filter field is a relationship by looking for a '.'
  isRelationship(field: string) {
    return field.includes('.') ? true : false;
  }

}
