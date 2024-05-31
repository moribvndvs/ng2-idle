import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuickstartComponent } from './quickstart/quickstart.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';




import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_INTERRUPTSOURCES, Idle, provideNgIdle } from '@ng-idle/core';
import { Keepalive, provideNgIdleKeepalive } from '@ng-idle/keepalive';
import { RouterOutlet, Routes, provideRouter } from '@angular/router';

const routes: Routes = [
  { path: 'quickstart', component: QuickstartComponent },
  { path: '', redirectTo: '/quickstart', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [PageNotFoundComponent, QuickstartComponent, MatToolbarModule, CommonModule, FontAwesomeModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    RouterOutlet
  ],
  providers: [
    provideRouter(routes),
    provideNgIdle(), 
    provideNgIdleKeepalive(),
    
  ]
})
export class AppComponent implements OnInit {
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  faGithub = faGithub;

  constructor(private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef) {
    idle.setIdle(5)
    idle.setTimeout(5);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      console.log(`${this.idleState} ${new Date()}`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    idle.onTimeout.subscribe(() => this.idleState = "TIMED_OUT");
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  reset() {
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }
  ngOnInit(): void {
    this.reset();
  }
}
