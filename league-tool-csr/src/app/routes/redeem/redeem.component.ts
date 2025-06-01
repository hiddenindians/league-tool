import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../services/user/user.service';
import { RedemptionDialogComponent } from './redemption-dialog/redemption-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RewardsService } from '../../services/rewards/rewards.service';
import { Reward } from '../../shared/models/reward.model';
@Component({
  selector: 'app-redeem',
  imports: [RouterLink, CommonModule, MatDialogModule, MatCheckboxModule, MatIconModule, MatCardModule, MatButtonModule, MatDividerModule, MatProgressBarModule], 
  templateUrl: './redeem.component.html',
  styleUrl: './redeem.component.scss'
})
export class RedeemComponent {
  redeemedPoints = 0; //total lifetime redemptions
  totalPoints = 0; //total earned
  availablePoints = 0; //points available for redemption
  remainingPoints = 0; //points remaining as rewards are selected
  toRedeem = 0; //to be redeemed
  selectedRewards: Set<any> = new Set(); // To track selected rewards
  currentUserId = ""
  isConfirmationPage = false;
  lowestRedeemable = 0;
  expiryTime: string = ""
  expiryDate: string = ""
  rewards: Reward[] = []

  constructor(private rewardsService: RewardsService, private auth: AuthService, private user: UserService, private dialog: MatDialog) {
    this.auth.currentUser.subscribe((user: any) => {
      this.currentUserId = user._id
      this.redeemedPoints = user.total_redeemed || 0;
      this.totalPoints = user.total_points || 0;
      this.availablePoints = this.totalPoints - this.redeemedPoints || 0;
      this.remainingPoints = this.availablePoints
    })

    this.rewardsService.getActiveRewards().subscribe((rewards: any) => {
      this.rewards = rewards
    })

    this.lowestRedeemable = this.rewards.reduce((min, reward) => reward.points < min ? reward.points : min, Infinity)
  }

  setExpiryTime(): void {
    const expiryDate = new Date();
    this.expiryDate = expiryDate.toLocaleDateString();
    expiryDate.setMinutes(expiryDate.getMinutes() + 20);
    this.expiryTime = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  claimMoreRewards(): void {
    this.isConfirmationPage = false;
    this.selectedRewards.clear();
    this.updateRemainingPoints()
  }

  redeemRewards(){
    
    this.user.updateRedeemedPoints(this.currentUserId, this.redeemedPoints + Array.from(this.selectedRewards).reduce((sum, r: any) => sum + r.points, 0))
      .then(()=> {
            this.user.updateRedemptionLog(this.currentUserId, this.selectedRewards)
      })
      .catch((err:any)=> {
        console.log(err)
      })
    this.setExpiryTime()
    this.isConfirmationPage = true
  }


  isCheckboxDisabled(reward: any): boolean {
    return !this.selectedRewards.has(reward) && reward.points > this.remainingPoints;
  }

  onRewardSelectionChange(reward: any): void {
    if (this.selectedRewards.has(reward)) {
      this.selectedRewards.delete(reward);
    } else {
      this.selectedRewards.add(reward);
    }

    this.updateRemainingPoints();
  }

  updateRemainingPoints(){
    const totalSelectedPoints = Array.from(this.selectedRewards).reduce((sum, r: any) => sum + r.points, 0);
    this.toRedeem = totalSelectedPoints;
    this.remainingPoints = this.availablePoints - totalSelectedPoints;
  }

  confirmRedemptionDialog(): void {
    const dialogRef = this.dialog.open(RedemptionDialogComponent, {
      data: {
        rewards: Array.from(this.selectedRewards),
        totalPoints: Array.from(this.selectedRewards).reduce((sum, r: any) => sum + r.points, 0)
      }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.redeemRewards();
      }
    })
  }

}
