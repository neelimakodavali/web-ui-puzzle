import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, getAllBooks, getBooksError, removeFromReadingList } from '@tmo/books/data-access';
import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { SnackBarService } from './snack-bar.service';

describe('SnackBarService', () => {
  let snackBarService: SnackBarService;
  let store: MockStore;
  let oc: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let dispatchSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackBarService, provideMockStore({ initialState: { books: { entities: [] } } })],
      imports: [NoopAnimationsModule, SharedTestingModule, MatSnackBarModule]
    });
    store = TestBed.inject(MockStore);
    snackBarService = TestBed.inject(SnackBarService);
    store.overrideSelector(getAllBooks, []);
    store.overrideSelector(getBooksError, null);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    oc = TestBed.inject(OverlayContainer);
    overlayContainerElement = oc.getContainerElement();
  });
  it('should be created',() => {
    expect(snackBarService).toBeTruthy();
  });

  it('should open the snackbar for adding the book to the reading list and undo it.',() => {
    const book = createBook('B');
    snackBarService.openSnackBar(true,book);
    const buttonElement: HTMLElement = overlayContainerElement.querySelector('.mat-simple-snackbar-action > button');
    buttonElement?.click();
    expect(dispatchSpy).toHaveBeenCalledWith(removeFromReadingList({item: {...book, bookId: 'B'}}));
  });

  it('should open the snackbar for removing the book from reading list and undo it.',() => {
    const book = createReadingListItem('B');
    snackBarService.openSnackBar(false,book);
    const buttonElement: HTMLElement = overlayContainerElement.querySelector('.mat-simple-snackbar-action > button');
    buttonElement?.click();
    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({book: {...book, id: 'B'}}));
  });
});
