import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { loader } from '../postlogin/commonvaribale/commonvalues';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    body: {}
  };

  httpOptionsform: any = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    }),
    body: {}
  };

  value: any;

  constructor(private httpClient: HttpClient) {
    this.value = '';
  }

  getAccessToken() {
    if (localStorage.getItem('currentUser') !== null)
      this.value = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.value.jwToken
      }),
      body: {}
    };
  }

  getmethod(url: string): Observable<any> {
    loader.loading = true;
    return this.httpClient.get<any>(environment.url + url).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  login(url: string, obj: any): Observable<any> {
    loader.loading = true;
    let httpOptio = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {}
    };

    return this.httpClient.post<any>(environment.url + url, obj, httpOptio).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  postmethod(url: string, obj: any): Observable<any> {
    loader.loading = true;
    this.getAccessToken();
    return this.httpClient.post(environment.url + url, obj, this.httpOptions).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  postmethodformultiparu(url: string, obj: any): Observable<any> {
    loader.loading = true;
    if (localStorage.getItem('currentUser') !== null)
      this.value = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        // 'Authorization': 'Bearer ' + this.value.jwToken/
      })
    };

    return this.httpClient.post(environment.url + url, obj, this.httpOptions).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  putmethod(url: string, obj: any): Observable<any> {
    loader.loading = true;
    this.getAccessToken();
    return this.httpClient.put(environment.url + url, obj, this.httpOptions).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  deletemethod(url: string, obj: any): Observable<any> {
    loader.loading = true;
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: obj
    };
    return this.httpClient.delete(environment.url + url, httpOption).pipe(
      map(response => {
       loader.loading = false;
        return this.onSuccess(response);
      }),
      catchError(err => {
       loader.loading = false;
        return this.onError(err);
      })
    );
  }

  deleteMethod(url: string, map: any) {
    if (localStorage.getItem('currentUser') !== null)
      this.value = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.value.jwToken
      }),
      body: map
    };

    return this.httpClient.delete(environment.url + url, this.httpOptions).pipe(
      map((response: any) => {
        return this.onSuccess(response);
      }),
      catchError(error => {
        return this.onError(error);
      })
    );

  }

  /**
    * onSuccess
    * @param response
    */
  private onSuccess(response: any): any {
    return response;
  }

  /**
   * onError
   * @param error
   */
  private onError(error: any): any {
    return throwError(error);
  }
}
