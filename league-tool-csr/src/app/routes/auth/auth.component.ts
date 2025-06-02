import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Errors } from '../../shared/models/errors.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { finalize, Observable, of } from 'rxjs';

interface AuthForm {
  email?: FormControl;
  password?: FormControl;
  username?: FormControl;
  resetPassword?: FormControl;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = { message: '', errors: {} };
  isSubmitting: Boolean = false;
  authForm: FormGroup<AuthForm>;
  destroyRef = inject(DestroyRef);
  isDiscordAuthenticating = false;
  token: string | null = null;
  sent: boolean = false;
  success: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: AuthService
  ) {
    this.authForm = new FormGroup<AuthForm>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
    });

    this.token = this.route.snapshot.queryParamMap.get('code');
    if (this.token) {
      this.handleDiscordCallback(this.token);
    }
  }

  ngOnInit() {
    // Use route data instead of parsing URL
    this.route.data.subscribe((data) => {
      this.authType = data['authType'];

      switch (this.authType) {
        case 'forgot':
          this.title = 'Forgot Password';
          this.authForm = new FormGroup<AuthForm>({
            email: new FormControl('', [Validators.required, Validators.email]),
          });
          break;
        case 'resend':
          this.title = 'Resend Verification';
          this.authForm = new FormGroup<AuthForm>({
            email: new FormControl('', [Validators.required, Validators.email]),
          });
          break;
        case 'reset':
          this.title = 'Reset Password';
          this.token = this.route.snapshot.queryParamMap.get('token') || '';
          if (!this.token) {
            this.errors = { message: 'Missing reset token', errors: {} };
          } else {
            this.authForm = new FormGroup<AuthForm>({
              resetPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
              ]),
            });
          }
          break;
        case 'callback':
          return;
        case 'verify':
          this.token =
            this.route.snapshot.queryParamMap.get('token') || ('' as string);

          if (!this.token) {
            this.errors = { message: 'Missing verification token', errors: {} };
          } else {
            this.isSubmitting = true;

            this.userService
              .verifyToken(this.token)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: () => {
                  this.title = 'Email Verified!';
                  this.isSubmitting = false;
                },
                error: (err: any) => {
                  this.errors = {
                    message: err.message || 'Verification failed',
                    errors: err.errors || {},
                  };
                  this.isSubmitting = false;
                },
              });
          }
          return;
        case 'register':
          this.title = 'Sign Up';
          this.authForm.addControl(
            'username',
            new FormControl('', Validators.required)
          );
          break;
        case 'login':
          this.title = 'Sign In';
      }
    });
  }

  loginWithDiscord(): void {
    this.userService.loginWithDiscord();
  }

  private handleDiscordCallback(token: string): void {
    this.isDiscordAuthenticating = true;
    this.userService
      .handleDiscordCallback(token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // Add delay to ensure auth state is properly set
        finalize(() => (this.isDiscordAuthenticating = false))
      )
      .subscribe({
        error: (err: any) => {
          console.log(err);
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }
  submitForm(): void {
    this.isSubmitting = true;
    this.errors = { message: '', errors: {} };

    let observable: Observable<any>;

    if (this.authType === 'login') {
      observable = this.userService.logIn(
        this.authForm.value as { email: string; password: string }
      );
    } else if (this.authType === 'register') {
      observable = this.userService.signUp(
        this.authForm.value as {
          username: string;
          email: string;
          password: string;
        }
      );
    } else if (this.authType === 'forgot') {
      observable = this.userService.forgotPassword(this.authForm.value.email);
    } else if (this.authType === 'resend') {
         // ⚠️ Call the method directly and handle result manually
    this.userService.sendVerification(this.authForm.value.email)
      .then(() => {
        this.success = true;
        this.sent = true;
        this.isSubmitting = false;
      })
      .catch((err: any) => {
        this.errors = {
          message: err.message || 'Could not send verification email',
          errors: err.errors || {},
        };
        this.isSubmitting = false;
      });
    return; // stop execution here
    } 
    else if (this.authType === 'reset') {
      observable = this.userService.resetPassword(
        this.token as string,
        this.authForm.value.resetPassword
      );
    }

    observable!.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log(err);
        this.errors = err;
        this.isSubmitting = false;
      },
    });
  }
}
