import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, clearSearch, getAllBooks, getBooksError, getBooksLoaded, searchBooks } from '@tmo/books/data-access';
import { BooksFeatureModule } from '@tmo/books/feature';
import { BookSearchComponent } from './book-search.component';
import { Book } from '@tmo/shared/models';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: { books: { entities: [] } } }),]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, []);
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('formatDate should return date', () => {
    expect(component.formatDate('03/17/2023')).toEqual('3/17/2023');
  })

  it('formatDate should return undefined', () => {
    expect(component.formatDate()).toBeUndefined();
  })

  it('Book should be added to readingList', () => {
    const book: Book = createBook('A');
    component.addBookToReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should search books with the search example', () => {
    component.searchExample();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
  });

  it('should search books with the search value entered in the textbox', () => {
    component.searchForm.controls.term.setValue('angular');
    store.overrideSelector(getBooksLoaded, true);
    store.overrideSelector(getAllBooks, [{ ...createBook('A'), isAdded: false }]);
    store.refreshState();
    component.searchBooks();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'angular' })
    );
  });

  it('should dispatch clear search if no search text exists', () => {
    component.searchForm.controls.term.setValue('');
    store.refreshState();
    component.searchBooks();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      clearSearch()
    );
  });
});
