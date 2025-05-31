import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkPortalOutlet, ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-dynamic-dialog',
  template: `<ng-template cdkPortalOutlet></ng-template>`,
  imports: [CommonModule, PortalModule, MatDialogModule],
})
export class DynamicDialogComponent {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

  constructor(
    public dialogRef: MatDialogRef<DynamicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { component: any }
  ) {}

  ngOnInit() {
    const portal = new ComponentPortal(this.data.component);
    this.portalOutlet.attachComponentPortal(portal);
  }
}