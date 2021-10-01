import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
