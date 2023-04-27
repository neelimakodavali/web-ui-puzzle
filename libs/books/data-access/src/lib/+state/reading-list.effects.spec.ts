import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should fetch reading list', done => {
        actions = new ReplaySubject();
        actions.next(effects.ngrxOnInitEffects());

        effects.loadReadingList$.subscribe(action => {
          expect(action).toEqual(
            ReadingListActions.loadReadingListSuccess({ list: [createReadingListItem('1'),createReadingListItem('2')] })
          );
          done();
        });

        httpMock.expectOne('/api/reading-list').flush([createReadingListItem('1'),createReadingListItem('2')]);
      });

      it('should fail to load reading list', done => {
        actions = new ReplaySubject();
        actions.next(ReadingListActions.init());
        const outcome = ReadingListActions.loadReadingListError(new ErrorEvent("error"));
        effects.loadReadingList$.subscribe(action => {
          expect(action.type).toEqual(outcome.type);
          done();
        });
        httpMock.expectOne('/api/reading-list').error(new ErrorEvent("error"));
      });

      it('should check book has been added to reading list', done => {
        actions = new ReplaySubject();
        actions.next(ReadingListActions.addToReadingList({book: createBook('angular')}));

        effects.addBook$.subscribe(action => {
          expect(action).toEqual(
            ReadingListActions.confirmedAddToReadingList({book: createBook('angular')})
          );
          done();
        });

        httpMock.expectOne('/api/reading-list').flush({book: createBook('angular')});
      });

      it('should check book has been removed from reading list', done => {
        actions = new ReplaySubject();
        actions.next(ReadingListActions.removeFromReadingList({item: createReadingListItem('123')}));

        effects.removeBook$.subscribe(action => {
          expect(action).toEqual(
            ReadingListActions.confirmedRemoveFromReadingList({item: createReadingListItem('123')})
          );
          done();
        });

        httpMock.expectOne('/api/reading-list/123').flush({item: createReadingListItem('123')});
      });

      it('should return failedAddToReadingList with book, on fail', (done) => {
        const book = createBook('B');
        actions = new ReplaySubject();
        actions.next(ReadingListActions.addToReadingList({ book }));

        effects.addBook$.subscribe((action) => {
          expect(action).toEqual(
            ReadingListActions.failedAddToReadingList({ book })
          );
          done();
        });
        httpMock
          .expectOne(`/api/reading-list`)
          .flush(book, { status: 400, statusText: 'Bad Request' });
      });

      it('should check confirmedBookFinished has been invoked or not when BookFinished gets success', done => {
        actions = new ReplaySubject();
        const item = createReadingListItem('A');
        actions.next(ReadingListActions.bookFinished({ item }));

        effects.bookFinished$.subscribe(action => {
          expect(action).toEqual(
            ReadingListActions.confirmedBookFinished({
              item
            })
          );
          done();
        });

        httpMock.expectOne('/api/reading-list/A/finished').flush(item);
      });

      it('should check failedBookFinished has been invoked when bookFinished gets failed', done => {
        actions = new ReplaySubject();
        const item = createReadingListItem('B');
        actions.next(ReadingListActions.bookFinished({ item }));

        effects.bookFinished$.subscribe(action => {
          expect(action).toEqual(
            ReadingListActions.failedBookFinished({ item })
          );
          done();
        });

        httpMock.expectOne('/api/reading-list/B/finished').error(new ErrorEvent('Error'));
      });
  });
});
