import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeathersService } from '../../services/api/feathers.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  code: string = '';
  status: 'pending' | 'success' | 'already' | 'error' | 'not-allowed' =
    'pending';
  redeemedBy: string = '';
  verifiedRedemptions: any[] = [];
  userSubscription: any;
  user: User | null = null;
  readonly allowedRoles = ['admin', 'staff'];

  constructor(
    private route: ActivatedRoute,
    private feathers: FeathersService,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.feathers.reauthenticate();

    this.userSubscription = this.auth.currentUser
       .pipe(filter((u) => !!u))
      .subscribe((user: any) => {
        this.user = user;
      });
    if (!this.allowedRoles.includes(this.user!.role)) {
      this.status = 'not-allowed';
    } else {
      // 1) Read the "code" from URL
      this.code = this.route.snapshot.paramMap.get('code') || '';
      if (!this.code) {
        this.status = 'already';
        return;
      }

      try {
        // 2) Reauthenticate (ensures token is valid)

        // 3) Find the code entry
        const codeResult: any = await this.feathers.service('codes').find({
          query: { code: this.code },
        });
        const matches = codeResult.data;

        if (matches.length > 1) {
          this.status = 'error';
          console.error('too many codes found');
          return;
        }

        if (matches.length === 0) {
          this.status = 'already';
          return;
        }

        const entry = matches[0];
        this.redeemedBy = entry.redeemedBy;

        if (!entry.used) {
          // 4) Mark code as used
          const patched = await this.feathers
            .service('codes')
            .patch(entry._id, { used: true });
          if (patched.used) {
            this.status = 'success';

            // 5) Fetch the user who redeemed
            const userResult: any = await this.feathers.service('users').find({
              query: { _id: this.redeemedBy },
            });
            const user = userResult.data[0] || null;
            if (user && Array.isArray(user.redemptions)) {
              // 6) Filter redemptions by code
              this.verifiedRedemptions = user.redemptions.filter(
                (r: any) => r.redemption_code === this.code
              );
            }
          } else {
            this.status = 'error';
          }
        } else {
          this.status = 'already';
        }
      } catch (err: any) {
        console.error('Verification error', err);
        this.status = 'error';
      }
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
