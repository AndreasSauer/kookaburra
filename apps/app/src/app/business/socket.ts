import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Deferred } from '../helper/deferred';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private _init = new Deferred<void>();
  public init = this._init.promise;

  private _socket!: Socket;

  public get socket(): Socket {
    return this._socket;
  }

  constructor(private authService: AuthService) {
    this.initSocket();
    this.authService.authChanged.subscribe(() => this.reconnectSocket());
  }

  private async initSocket() {
    console.log('createsocket', 'start');
    await this.authService.init;
    console.log('createsocket', 'authinit resolved');
    if (this.authService.isAuth) {
      console.log('createsocket', 'authservice is auth');
      this.createSocket();
      this._init.resolve();
    }
    console.log('createsocket', 'socket init');
  }

  public reconnectSocket() {
    console.log('reconnectSocket', this.authService.authToken);
    this.createSocket();
    this._init.resolve();
  }

  private createSocket() {
    this._socket = io(environment.serverUrl, {
      extraHeaders: {
        token: this.authService.authToken || '',
      },
    });
    this._socket.on('connect_error', (err) => {
      console.log('error during connect websocket', err);
      this.authService.setUnAuth();
    });
  }
}
