import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../business/auth.service';

@Component({
  selector: 'kookaburra-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.form = new FormGroup({
      mail: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  public async login() {
    try {
      const form = this.form.value;
      await this.authService.login(form.mail, form.password);
      this.router.navigate(['tabs/recipes']);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Login fehlgeschlagen. E-Mail oder Passwort falsch',
        duration: 2000,
      });
      toast.present();
    }
  }
}
