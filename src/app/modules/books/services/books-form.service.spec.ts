import { TestBed } from '@angular/core/testing';

import { BooksFormService } from './books-form.service';

describe('BooksFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BooksFormService = TestBed.get(BooksFormService);
    expect(service).toBeTruthy();
  });
});
