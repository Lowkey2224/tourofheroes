import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {MessageService} from '../message.service';
import {of} from 'rxjs/observable/of';

@Injectable()
export class AuthenticationService {

  public token: string;
  private loginUrl = `${environment.apiUrl}/api/login_check`;  // URL to web api

  constructor(private http: HttpClient,
              private messageService: MessageService) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    const body = new HttpParams({fromObject: {_username: username, _password: password}});
    return this.http.post<string>(`${this.loginUrl}?XDEBUG_SESSION_START=PHPSTORM`, body).pipe(
      map(result => result['token']),
      tap((token) => {
        if (token) {
          this.token = token;
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
        }
      }),
      tap(token => {
        if (token) {
          this.log(`logged in as user ${username}`);
        } else {
          this.log(`login failed`);
        }
      }),
      catchError(this.handleError<string>('login'))
    );
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('Login: ' + message);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
