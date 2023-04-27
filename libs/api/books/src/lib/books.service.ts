import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
// @ts-ignore
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BooksService {
  constructor(private readonly http: HttpService) {}

  search(term: string): Observable<Book[]> {
    if (!term) {
      throw new Error('Missing search term');
    }

    return this.http
      .get(`https://www.googleapis.com/books/v1/volumes?q=${term}`)
      .pipe(
        map(resp => {
          if (resp?.data?.items) {
            return resp.data.items.map(item => {
              return {
                id: item.id,
                title: item.volumeInfo?.title,
                authors: item.volumeInfo?.authors || [],
                description: item.searchInfo?.textSnippet,
                publisher: item.volumeInfo?.publisher,
                publishedDate: item.volumeInfo?.publishedDate
                  ? new Date(item.volumeInfo?.publishedDate).toISOString()
                  : undefined,
                coverUrl: item.volumeInfo?.imageLinks?.thumbnail
              };
            });
          } else {
            throw new HttpException('No Books were found for the given search. Response is empty', HttpStatus.NOT_FOUND);
          }
        })
      );
  }
}
