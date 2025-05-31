import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { User } from '../../../shared/models/user.model';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { FeathersService } from '../../../services/api/feathers.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {
  users: any[] = [];
  editingUser: User | null = null;
  originalPoints: number | null = null;

  constructor(private auth: AuthService, private feathers: FeathersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.feathers
      .service('users')
      .find({ query: {} })
      .then((data: any) => {
        this.users = Array.isArray(data) ? data : data.data;
        console.log(data.data)
      })
      .catch((err: any) => console.error('error loading users', err));
  }
  startEdit(user: User) {
    this.editingUser = user;
    this.originalPoints = user.total_points;
  }

  savePoints(user: User | null) {
    if (user == null) return;
    if (!this.editingUser) return;

    this.feathers
      .service('users')
      .patch(user._id, { total_points: user.total_points })
      .then(() => {
        (this.editingUser = null), (this.originalPoints = null);
      })
      .catch((err: any) => console.error('Error saving points', err));
  }
  cancelEdit() {
    if (this.editingUser && this.originalPoints != null) {
      this.editingUser.total_points = this.originalPoints;
    }
    this.editingUser = null;
    this.originalPoints = null;
  }
}
