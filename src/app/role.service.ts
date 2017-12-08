import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {Role} from './role';


const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable()
export class RoleService {

  private rolesUrl = 'http://api.app/api/roles';  // URL to web api


  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  private static transformRole(role) {
    console.log(role);
    return role;
  }

  /** GET roles from the server */
  getRoles(): Observable<Role[]> {
    const url = `${this.rolesUrl}?XDEBUG_SESSION_START=PHPSTORM`;

    return this.http.get<Role[]>(url, httpOptions)
      .pipe(
        map(result => result['hydra:member']),
        tap(_ => this.log(`fetched Roles`)),
        catchError(this.handleError('getRoles', []))
      );
  }

  /** GET role by id. Will 404 if id not found */
  getRole(id: number): Observable<Role> {
    const url = `${this.rolesUrl}/${id}?XDEBUG_SESSION_START=PHPSTORM`;
    return this.http.get<Role>(url, httpOptions).pipe(
      map(result => RoleService.transformRole(result)),
      tap(_ => this.log(`fetched role id=${id}`)),
      catchError(this.handleError<Role>(`getRole id=${id}`))
    );
  }

  /** PUT: update the role on the server */
  updateRole(role: Role): Observable<any> {
    const url = `${this.rolesUrl}/${role.id}?XDEBUG_SESSION_START=PHPSTORM`;
    console.log(httpOptions);
    return this.http.put(url, role, httpOptions).pipe(
      tap(_ => this.log(`updated role id=${role.id}`)),
      catchError(this.handleError<any>('updateRole'))
    );
  }

  /** POST: add a new role to the server */
  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.rolesUrl}?XDEBUG_SESSION_START=PHPSTORM`, role, httpOptions).pipe(
      tap((localRole: Role) => this.log(`added role w/ id=${localRole.id}`)),
      catchError(this.handleError<Role>('addRole'))
    );
  }

  /** DELETE: delete the role from the server */
  deleteRole(role: Role | number): Observable<Role> {
    const id = typeof role === 'number' ? role : role.id;
    const url = `${this.rolesUrl}/${id}`;

    return this.http.delete<Role>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted role id=${id}`)),
      catchError(this.handleError<Role>('deleteRole'))
    );
  }

  /* GET roles whose name contains search term */
  searchroles(term: string): Observable<Role[]> {
    if (!term.trim()) {
      // if not search term, return empty role array.
      return of([]);
    }
    return this.http.get<Role[]>(`${this.rolesUrl}?name=${term}`).pipe(
      map(result => result['hydra:member']),
      tap(_ => this.log(`found roles matching "${term}"`)),
      catchError(this.handleError<Role[]>('searchroles', []))
    );
  }

  /** Log a RoleService message with the MessageService */
  private log(message: string) {
    this.messageService.add('RoleService: ' + message);
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