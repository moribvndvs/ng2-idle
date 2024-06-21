import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuickstartComponent } from './quickstart/quickstart.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { DEFAULT_INTERRUPTSOURCES, Idle, provideNgIdle } from '@ng-idle/core';
import { RouterOutlet } from '@angular/router';
import { provideNgIdleKeepalive, Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    PageNotFoundComponent, 
    QuickstartComponent, 
    MatToolbarModule, 
    FontAwesomeModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    RouterOutlet,
    NgIf,
    NgClass,
    DatePipe
  ],
})
export class AppComponent implements OnInit {
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  faGithub = faGithub;

  constructor(private idle: Idle, private keepalive: Keepalive, private cd: ChangeDetectorRef) {
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
