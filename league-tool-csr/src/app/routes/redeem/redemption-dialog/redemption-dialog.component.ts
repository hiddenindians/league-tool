import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Reward } from '../../../shared/models/reward.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-redemption-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './redemption-dialog.component.html',
  styleUrl: './redemption-dialog.component.scss'
})
export class RedemptionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RedemptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rewards: Reward []; totalPoints: number}

  ) {}
  
  onCancel(): void {
    this.dialogRef.close(false)
  }

  onConfirm(): void{
    this.dialogRef.close(true)
  }

}
