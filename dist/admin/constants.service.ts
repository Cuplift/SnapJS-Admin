import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  /**
   * Required constants
   * If you are overwritting these using your own ConstantsService
   * You must make sure to include all of them because they are all used in some way.
   */
  API_BASE_URL = 'http://localhost:3000/api';
  AWS_S3_BASE_URL = '';
  FILE_UPLOAD_DEFAULT_ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'text/plain', 'text/csv', 'audio/mpeg', 'video/mp4',
  ];
  FILE_UPLOAD_DEFAULT_MAX_FILE_SIZE: number = 10000000;
  IMAGE_MIME_TYPES: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  /**
   * Example sidebar items
   */
  SIDEBAR_ITEMS: object[] = [
    {
      title: 'Users',
      icon: 'users',
      class: 'User',
    },
    {
      title: 'Companies',
      icon: 'mobile',
      class: 'Company',
    },
  ];

  /**
   * Example Schema Overwrites
   */
  DEFAULT_SCHEMA_OVERWRITES: object = {
    Company: {
      roles: {
        instance: 'MultiSelect',
        options: ['admin', 'manager', 'user', 'employee'],
      },
      singleRole: {
        instance: 'SingleSelect',
        options: ['admin', 'manager', 'user', 'super admin', 'intern'],
      },
      overview: {
        instance: 'Wysiwyg',
      },
      __v: {
        instance: 'Remove',
      },
      _id: {
        instance: 'Hidden',
      },
      createdAt: {
        instance: 'Disabled',
      },
      updatedAt: {
        instance: 'Disabled',
      },
      avatar: {
        instance: 'Image',
      },
      images: {
        instance: 'ImageArray',
        allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png'],
      },
      file: {
        instance: 'File',
      },
      files: {
        instance: 'FileArray',
      },
      _createdBy: {
        searchField: 'firstName',
      },
      _locations: {
        searchField: 'name',
      },
      _relationship: {
        searchField: 'name',
      },
    },
    User: {
      avatar: {
        instance: 'Image',
        allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png'],
      },
    },
  };

  ADMIN_WYSIWYG_OPTIONS: object = {};

}
