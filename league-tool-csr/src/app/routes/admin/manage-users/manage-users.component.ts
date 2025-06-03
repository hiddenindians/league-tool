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
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {
  users: any[] = [];
  editingUser: User | null = null;
  originalPoints: number | null = null;
  originalRole: string | null = null;
  originalVerified: boolean | null = null;

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
      })
      .catch((err: any) => console.error('error loading users', err));
  }
  startEdit(user: User) {
    this.editingUser = user;
    this.originalPoints = user.total_points;
    this.originalRole = user.role;
    this.originalVerified = user.isVerified;
  }

  savePoints(user: User | null) {
    if (user == null) return;
    if (!this.editingUser) return;

    const updateData: any = {};
    if (user.total_points !== this.originalPoints) {
      updateData.total_points = user.total_points;
    }
    if (user.role !== this.originalRole) {
      updateData.role = user.role;
    }
    if (user.isVerified !== this.originalVerified) {
      updateData.isVerified = user.isVerified;
    }

    if (Object.keys(updateData).length === 0) {
      this.editingUser = null;
      this.originalPoints = null;
      this.originalRole = null;
      this.originalVerified = null;
      return;
    }

    this.feathers
      .service('users')
      .patch(user._id, updateData)
      .then(() => {
        this.editingUser = null;
        this.originalPoints = null;
        this.originalRole = null;
        this.originalVerified = null;
      })
      .catch((err: any) => console.error('Error saving points', err));
  }
  cancelEdit() {
    if (this.editingUser && this.originalPoints != null) {
      this.editingUser.total_points = this.originalPoints;
    }
    if (this.editingUser && this.originalRole != null) {
      this.editingUser.role = this.originalRole;
    }
    this.editingUser = null;
    this.originalPoints = null;
    this.originalRole = null;
  }
}
