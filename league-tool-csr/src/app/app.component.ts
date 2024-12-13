import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'league-tool-csr';
  private auth = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.auth.reauthenticate();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
