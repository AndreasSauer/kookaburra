import { Component } from '@angular/core';

import { AuthService } from './business/auth.service';

@Component({
  selector: 'kookaburra-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authservice: AuthService) {}
}
