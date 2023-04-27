import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('loadBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
    it('check search action with searchText', () => {
      const searchAction = BooksActions.searchBooks({ term: 'typescript' });
      const result: State = reducer(initialState, searchAction);
      expect(result.searchTerm).toBe('typescript');
    });
    it('load book failure should return error message', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const searchFailError = BooksActions.searchBooksFailure({ error: 'No books found.' });
      const result: State = reducer({ ...initialState, ...books }, searchFailError);
      expect(result.loaded).toBe(false);
      expect(result.ids.length).toBe(0);
      expect(result.error).toEqual('No books found.');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
