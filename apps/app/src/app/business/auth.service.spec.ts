import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { AuthService } from './auth.service';

describe('auth service', () => {
  let mockRouter: Router;
  let mockhttp: HttpClient;

  const localStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => {
        return store[key];
      },
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key: string) {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    mockRouter = mock(Router);
    mockhttp = mock(HttpClient);
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  describe('constructor', () => {
    it('should set auth to false and reroute to login when no token is set in localstorage', () => {
      const authService = new AuthService(
        instance(mockRouter),
        instance(mockhttp)
      );
      expect(authService.isAuth).toBe(false);
      verify(mockRouter.navigate(deepEqual(['login']))).once();
    });

    it('should set isauth to true when token is set', () => {
      localStorage.setItem('token', 'token');
      const authService = new AuthService(
        instance(mockRouter),
        instance(mockhttp)
      );
      expect(authService.isAuth).toBe(true);
      verify(mockRouter.navigate(anything())).never();
    });
  });

  describe('login', () => {
    let authService: AuthService;

    let postSubject: Subject<{ token: string }>;
    let postObservable: Observable<{ token: string }>;

    beforeEach(() => {
      localStorage.setItem('token', 'old_token');
      authService = new AuthService(instance(mockRouter), instance(mockhttp));
      postSubject = new Subject();
      postObservable = postSubject.asObservable();
      when(mockhttp.post(anything(), anything())).thenReturn(postObservable);
    });

    it('should create http request', async () => {
      await new Promise((resolve) => {
        authService.login('mail', 'pass');
        postSubject.next({ token: 'new_token' });
        setTimeout(resolve, 100);
      });
      verify(
        mockhttp.post(
          'http://localhost:3000/login',
          deepEqual({ mail: 'mail', password: 'pass' })
        )
      ).once();
    });

    it('should set token in localstorage', async () => {
      await new Promise((resolve) => {
        authService.login('mail', 'pass');
        postSubject.next({ token: 'new_token' });
        setTimeout(resolve, 100);
      });
      const token = localStorage.getItem('token');
      expect(token).toBe('new_token');
    });

    it('should fail when http service fails', async () => {
      when(mockhttp.post).thenThrow(new Error());
      const promise = new Promise((resolve, reject) => {
        authService.login('mail', 'pass').catch(reject);
        postSubject.next({ token: 'new_token' });
        setTimeout(resolve, 100);
      });
      expect(promise).rejects.toThrow('login failed');
    });
  });

  describe('setUnAuth', () => {
    let authService: AuthService;

    beforeEach(() => {
      localStorage.setItem('token', 'old_token');
      authService = new AuthService(instance(mockRouter), instance(mockhttp));
    });

    it('should set isAuth to false', () => {
      authService.setUnAuth();
      expect(authService.isAuth).toBe(false);
    });

    it('should call router navigate', () => {
      authService.setUnAuth();
      verify(mockRouter.navigate(deepEqual(['login']))).once();
    });
  });
});
