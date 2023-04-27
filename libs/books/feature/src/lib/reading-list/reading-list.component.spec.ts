import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;
  let overlayContainerElement: HTMLElement;
  let spyTest: any;
  let oc: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { items: {} } })]
    }).compileComponents();
    store = TestBed.inject(MockStore);
    oc = TestBed.inject(OverlayContainer);
    overlayContainerElement = oc.getContainerElement();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getReadingList, []);
    fixture.detectChanges();
    spyTest = spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove book from reading list', () => {
    const book = createReadingListItem('B');
    component.removeFromReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
  });

  it('should mark a book as read', () => {
    const book = createReadingListItem('A');
    book.finished = true;
    component.bookFinished(book);
    expect(store.dispatch).toHaveBeenCalled();
  });
});
