import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Reward } from '../../../shared/models/reward.model';
import { RewardsService } from '../../../services/rewards/rewards.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-rewards',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './manage-rewards.component.html',
  styleUrl: './manage-rewards.component.scss',
})
export class ManageRewardsComponent {
  rewards: Reward[] = [];
  rewardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rewardsService: RewardsService,
    private auth: AuthService,
    private router: Router
  ) {
    this.rewardForm = this.fb.group({
      title: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      type: ['', Validators.required],
      active: [true]
    });

    this.auth.currentUser.subscribe((user: any) => {
      if(!(user?.role === 'admin')){
        this.router.navigate(['/']);
      }
    })
  }

  ngOnInit() {
    this.loadRewards();
  }

  loadRewards() {
    this.rewardsService.getRewards().subscribe(
      rewards => this.rewards = rewards
    )
  }

  addReward() {
    if(this.rewardForm.valid) {
      this.rewardsService.createReward(this.rewardForm.value).subscribe(() => {
        this.loadRewards();
        this.rewardForm.reset();
      })
    }
  }
  editReward(reward: Reward) {

  }

  deleteReward(id: string){
    if(confirm('Are you dure you want to delete this reward?')){
      this.rewardsService.deleteReward(id).subscribe(() => {
        this.loadRewards();
      })
    }
  }
}
