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
import { FeathersService } from '../../services/api/feathers.service';
import { RewardsService } from '../../services/rewards/rewards.service';
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

  rewards = [
    {
      title: "Canned Pop (355ml)",
      points: 3,
      description: "Redeem 3 Points for this reward",
      type: "food"
    },
    {
      title: "GameGenic Sideholder",
      points: 5,
      description: "Redeem 5 Points for this reward",
      type: "acessory"
    },
    {
      title: "Bottle Pop (710ml)",
      points: 5,
      description: "Redeem 3 Points for this reward",
      type: "drink"
    },
    {
      title: "Bag of Chips (66g)",
      points: 5,
      description: "Redeem 5 Points for this reward",
      type: "food"
    },
    {
      title: "Chocolate Bar",
      points: 5,
      description: "Redeem 5 Points for this reward",
      type: "food"
    },
    {
      title: "Card Dividers",
      points: 5,
      description: "Redeem 5 Points for this reward",
      type: "accessory"
    },
    {
      title: "Bag of Candy (160g/180g)",
      points: 10,
      description: "Redeem 5 Points for this reward",
      type: "food"
    },
    {
      title: "Inner Sleeves",
      points: 10,
      description: "Redeem 10 Points for this reward",
      type: "accessory"
    },
    {
      title: "Energy Drink (Except Red Bull)",
      points: 10,
      description: "Redeem 10 Points for this reward",
      type: "food"
    },
    {
      title: "Red Bull",
      points: 15,
      description: "Redeem 15 Points for this reward",
      type: "food"
    },
    {
      title: "Bag of Jerky (80g)",
      points: 15,
      description: "Redeem 15 Points for this reward.",
      type: "food"
    },
    {
      title: "Booster Pack [Any Game] ($9 value maximum)",
      points: 15,
      description: "Redeem 15 Points for this reward.",
      type: "booster pack"
    },
    {
      title: "Lorcana Sleeves",
      points: 20,
      description: "Redeem 20 Points for this reward",
      type: "accessory"
    },
    {
      title: "GameGenic Outer Sleeves",
      points: 30,
      description: "Redeem 30 Points for this reward",
      type: "accessory"
    },
    {
      title: "One Piece Art Sleeves",
      points: 30,
      description: "Redeem 30 Points for this reward",
      type: "accessory"
    },
    {
      title: "GameGenic Outer Sleeves",
      points: 30,
      description: "Redeem 30 Points for this reward",
      type: "accessory"
    },
    {
      title: "Dragon Shield Dual Matte Outer Sleeves",
      points: 35,
      description: "Redeem 35 Points for this reward",
      type: "accessory"
    },
    {
      title: "36d6 Dice Block",
      points: 40,
      description: "Redeem 40 Points for this reward",
      type: "accessory"
    },
    {
      title: "Collector Booster ($32 value maximum)",
      points: 75,
      description: "Redeem 75 Points for this reward",
      type: "booster pack"
    },
    {
      title: "Collector Booster ($45 value maximum)",
      points: 95,
      description: "Redeem 95 Points for this reward",
      type: "booster pack"
    },

  ]




  constructor(private rewardsService: RewardsService, private auth: AuthService, private user: UserService, private dialog: MatDialog) {
    this.auth.currentUser.subscribe((user: any) => {
      this.currentUserId = user._id
      this.redeemedPoints = user.total_redeemed || 0;
      this.totalPoints = user.total_points || 0;
      this.availablePoints = this.totalPoints - this.redeemedPoints || 0;
      this.remainingPoints = this.availablePoints
    })

    this.rewardsService.getRewards().subscribe((rewards: any) => {
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
