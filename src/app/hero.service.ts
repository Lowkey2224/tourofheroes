import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import {Hero} from './hero';
import {MessageService} from './message.service';
import {RoleService} from './role.service';
import {environment} from '../environments/environment';
import {AuthenticationService} from './authentication/authentication.service';

@Injectable()
export class HeroService {
  private heroesUrl = `${environment.apiUrl}/api/people`;  // URL to web api


  constructor(private http: HttpClient,
              private messageService: MessageService,
              private roleService: RoleService,
              private authenticationService: AuthenticationService) {
  }

  private static transformHero(hero) {
    hero.dateOfBirth = new Date(hero.dateOfBirth);
    console.log(hero);
    return hero;
  }

  /** GET heroes from the server */
  getHeroes(page: number): Observable<Hero[]> {
    const url = `${this.heroesUrl}?XDEBUG_SESSION_START=PHPSTORM&itemsPerPage=15&page=${page}`;
    return this.http.get<Hero[]>(url, this.httpOptions())
      .pipe(
        map(result => result['hydra:member']),
        map(result => result), // Get additional Resources
        tap(_ => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}?XDEBUG_SESSION_START=PHPSTORM`;
    return this.http.get<Hero>(url, this.httpOptions()).pipe(
      map(result => HeroService.transformHero(result)),
      map(hero => this.heroFactory(hero)),
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    const body = this.createBody(hero);
    const url = `${this.heroesUrl}/${hero.id}?XDEBUG_SESSION_START=PHPSTORM`;
    console.log(this.httpOptions());
    return this.http.put(url, body, this.httpOptions()).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    const body = this.createBody(hero);
    return this.http.post<Hero>(`${this.heroesUrl}?XDEBUG_SESSION_START=PHPSTORM`, body, this.httpOptions()).pipe(
      tap((localHero: Hero) => this.log(`added hero w/ id=${localHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions()).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}?name=${term}`).pipe(
      map(result => result['hydra:member']),
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private createBody(hero: Hero) {
    const roles = [];
    for (const role of hero.roles) {

      roles.push(this.roleService.transformRoleToResource(role));
    }
    hero.roles = roles;
    return hero;
  }

  private heroFactory(hero: Hero): Hero {
    return this.roleService.getRolesForHero(hero);
    // .subscribe(roles => hero.roles = roles);
    // return hero;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
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

  private httpOptions() {

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authenticationService.token
      })
    };
  }
}
