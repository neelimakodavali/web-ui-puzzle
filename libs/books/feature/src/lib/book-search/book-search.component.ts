import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  bookSearchSubscription$: Subscription;
  readonly getAllBooks$ = this.store.select(getAllBooks);
  readonly getBooksError$ = this.store.select(getBooksError);
  readonly getBooksLoaded$ = this.store.select(getBooksLoaded);

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.bookSearchSubscription$ = this.searchForm.get("term").valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap( val => of(val))).subscribe(newVal => {
      if (newVal) {
        this.store.dispatch(searchBooks({ term: newVal }));
      } else {
        this.store.dispatch(clearSearch());
      }
    })
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
  }

   ngOnDestroy() {
      this.bookSearchSubscription$?.unsubscribe();
  }
}
