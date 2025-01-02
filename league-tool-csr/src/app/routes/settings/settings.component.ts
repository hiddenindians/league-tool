import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  userSubscription: any;
  username: string = ""
  email: string = ""
  id: string = ""

  constructor(private auth: AuthService, private user: UserService) {

  }

  ngOnInit() {
    this.userSubscription = this.auth.currentUser.subscribe((user: any) => {
      this.username = user.username;
      this.email = user.email;
      this.id = user._id
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  updateUsername(username: string){
    this.user.updateUsername(this.id, username)
  }
}
