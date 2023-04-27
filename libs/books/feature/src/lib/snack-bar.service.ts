import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addToReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { Book, ReadingListItem } from '@tmo/shared/models';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {

  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  openSnackBar(isAdded: boolean, book: (Book | ReadingListItem)) {
    const snackBarRef = this._snackBar.open(isAdded ? `Added ${book.title} to Reading List` : `Removed ${book.title} from reading List`, "Undo", {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
      });
      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(isAdded ? removeFromReadingList({
          item: {
            bookId: (book as Book).id,
            ...book
          }
        }) : addToReadingList({
            book: {
              id: (book as ReadingListItem).bookId, ...book
            }
          }))
      })
  }
}
