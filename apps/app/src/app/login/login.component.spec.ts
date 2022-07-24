import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { AuthService } from '../business/auth.service';
import { LoginComponent } from './login.component';

describe('login component', () => {
  let component: LoginComponent;
  let mockAuthService: AuthService;
  let mockToastContoller: ToastController;
  let mockRouter: Router;
  let mockToast: HTMLIonToastElement;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    mockAuthService = mock(AuthService);
    mockToastContoller = mock(ToastController);
    mockRouter = mock(Router);
    mockToast = mock<HTMLIonToastElement>();
    when(mockToastContoller.create(anything())).thenResolve(
      instance(mockToast)
    );
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: instance(mockAuthService) },
        { provide: Router, useValue: instance(mockRouter) },
        { provide: ToastController, useValue: instance(mockToastContoller) },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
      imports: [IonicModule, FormsModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('send button should be disabled when mail and password is not entered', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const submitButton = hostElement.querySelector('ion-button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('button should be enabled when form is filled', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    component.form.controls['mail'].setValue('mail@mail.de');
    component.form.controls['password'].setValue('pass');
    fixture.detectChanges();
    const submitButton = hostElement.querySelector('ion-button');
    expect(submitButton?.disabled).toBe(false);
  });

  it('should call auth service when submit is clicked', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    component.form.controls['mail'].setValue('mail@mail.de');
    component.form.controls['password'].setValue('pass');
    fixture.detectChanges();
    hostElement.querySelector('ion-button')?.click();
    verify(mockAuthService.login('mail@mail.de', 'pass')).once();
  });

  it('should call router after authservice', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    component.form.controls['mail'].setValue('mail@mail.de');
    component.form.controls['password'].setValue('pass');
    fixture.detectChanges();
    hostElement.querySelector('ion-button')?.click();
    verify(mockRouter.navigate(deepEqual(['tabs/recipes']))).calledAfter(
      mockAuthService.login(anything(), anything())
    );
  });

  it('should show toast when authservice login fails', () => {
    when(mockAuthService.login(anything(), anything())).thenReject(new Error());
    const hostElement: HTMLElement = fixture.nativeElement;
    component.form.controls['mail'].setValue('mail@mail.de');
    component.form.controls['password'].setValue('pass');
    fixture.detectChanges();
    hostElement.querySelector('ion-button')?.click();
    verify(
      mockToastContoller.create(
        deepEqual({
          message: 'Login fehlgeschlagen. E-Mail oder Passwort falsch',
          duration: 2000,
        })
      )
    ).once();
  });
});
