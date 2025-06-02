import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  redeemedPoints = 0;
  totalPoints = 0;
  availablePoints = 0;
  username = '';
  avatar = '';
  userSubscription: any;
  isVerified: boolean = false
  email: string = ""

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.reauthenticate()
    this.userSubscription = this.auth.currentUser
      .pipe(filter((u) => !!u))
      .subscribe((user: any) => {
        this.redeemedPoints = user.total_redeemed || 0;
        this.totalPoints = user.total_points || 0;
        this.availablePoints = this.totalPoints - this.redeemedPoints || 0;
        this.username = user.username;
        this.avatar = user.avatar;
        this.isVerified = user.isVerified
        this.email = user.email
      });
  }

  resendVerification() {
    this.auth.sendVerification(this.email)
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
