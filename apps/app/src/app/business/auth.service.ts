import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subject, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { Deferred } from '../helper/deferred';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _init = new Deferred<void>();
  public init = this._init.promise;

  private _authChangedSubject = new Subject<void>();
  public authChanged = this._authChangedSubject.asObservable();

  public isAuth = false;

  public get authToken(): string | null {
    return localStorage.getItem('token');
  }

  constructor(private router: Router, private http: HttpClient) {
    this.authenticate();
  }

  public authenticate() {
    const token = this.authToken;
    if (!token) {
      this.router.navigate(['login']);
      this.isAuth = false;
      this._init.resolve();
      return;
    }
    this.isAuth = true;
    this._init.resolve();
  }

  public async login(mail: string, password: string) {
    try {
      const result = await lastValueFrom(
        this.http
          .post(`${environment.serverUrl}/login`, { mail, password })
          .pipe(take(1))
      );
      localStorage.setItem('token', (result as { token: string }).token);
      this._authChangedSubject.next();
    } catch (error) {
      throw new Error('login failed');
    }
  }

  public setUnAuth() {
    this.isAuth = false;
    this.router.navigate(['login']);
  }
}
