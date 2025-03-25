import {
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Errors } from '../../shared/models/errors.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FeathersService } from '@feathersjs/feathers';
import { finalize } from 'rxjs';

interface AuthForm {
  email: FormControl;
  password: FormControl;
  username?: FormControl;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
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
  errors: Errors = { errors: {} };
  isSubmitting: Boolean = false;
  authForm: FormGroup<AuthForm>;
  destroyRef = inject(DestroyRef);
  isDiscordAuthenticating = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: AuthService
  ) {
    this.authForm = new FormGroup<AuthForm>({
      email: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    const token = this.route.snapshot.queryParamMap.get('code');
    console.log(token)
    if (token) {
      this.handleDiscordCallback(token);
    }
  }

  ngOnInit() {
    // Use route data instead of parsing URL
    this.route.data.subscribe((data) => {
      this.authType = data['authType'];

      if (this.authType.includes('callback')) {
        console.log('callback');
        return;
      }

      console.log(this.authType);
      this.title = this.authType === 'login' ? 'Sign in' : 'Sign up';

      // Add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl(
          'username',
          new FormControl('', Validators.required)
        );
      }
    });
  }

  loginWithDiscord(): void {
    this.userService.loginWithDiscord();
  }

  private handleDiscordCallback(token: string): void {
    console.log(token)
    this.isDiscordAuthenticating = true;
    this.userService
      .handleDiscordCallback(token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isDiscordAuthenticating = false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.log(err)
          this.errors = err;
          this.isSubmitting = false;
          this.router.navigate(['/auth/login']);
        },
      });
  }

  submitForm(): void {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    let observable =
      this.authType === 'login'
        ? this.userService.logIn(
            this.authForm.value as { email: string; password: string }
          )
        : this.userService.signUp(
            this.authForm.value as {
              username: string;
              email: string;
              password: string;
            }
          );

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log(err)
        this.errors = err;
        this.isSubmitting = false;
      },
    });
  }
}
