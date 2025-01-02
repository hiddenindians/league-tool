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
  isEditing: boolean = false;
  editingRewardId: string | null = null;

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
    if (this.rewardForm.valid) {
      if (this.isEditing && this.editingRewardId) {
        this.saveEdit();
      } else {
        this.rewardsService.createReward(this.rewardForm.value).subscribe({
          next: () => {
            this.loadRewards();
            this.rewardForm.reset();
          },
          error: (error: any) => {
            console.error('Error creating reward:', error);
            // Handle error (show message to user)
          }
        });
      }
    }
  }

  editReward(reward: Reward) {
    this.isEditing = true;
    this.editingRewardId = reward._id;

    this.rewardForm.patchValue({
      title: reward.title,
      points: reward.points,
      description: reward.description,
      type: reward.type,
      active: reward.active
    })
  }

  cancelEdit(){
    this.isEditing = false;
    this.editingRewardId = null;
    this.rewardForm.reset();
  }

  saveEdit(){
    if (this.rewardForm.valid && this.editingRewardId) {
      this.rewardsService.updateReward(this.editingRewardId, this.rewardForm.value)
        .subscribe({
          next: () => {
            this.loadRewards();
            this.cancelEdit();
          },
          error: (error: any) => {
            console.error('Error updating reward:', error);
            // Handle error (show message to user)
          }
        });
    }
  }

  deleteReward(id: string){
    if(confirm('Are you dure you want to delete this reward?')){
      this.rewardsService.deleteReward(id).subscribe(() => {
        this.loadRewards();
      })
    }
  }
}
