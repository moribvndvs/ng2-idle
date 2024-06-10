import { Component, OnInit } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
@Component({
  selector: 'app-quickstart',
  templateUrl: './quickstart.component.html',
  styleUrls: ['./quickstart.component.css'],
  standalone : true,
  imports: [Highlight]
})
export class QuickstartComponent implements OnInit {
  newNg = `
    ng new my-idle-app
    cd my-idle-app
  `;
  installNg = `
    ng add @ng-idle/core
    # Optional
    ng add @ng-idle/keepalive
  `;
  configureModule = `
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // omit if not using keepalive
import { BrowserModule } from '@angular/platform-browser';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // use import {NgIdleModule} from '@ng-idle/core'; if not using keepalive

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot() // use NgIdleModule.forRoot() if not using keepalive
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
  `;

  configureApplicationConfig = `
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // omit if not using keepalive
import { provideNgIdleKeepalive } from '@ng-idle/keepalive';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgIdleKeepalive(), // use provideNgIdle() if not using keepalive
    provideHttpClient(withFetch())
  ]
};
  `;

  configureStandaloneComponent = `
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef) {
    // set idle parameters
    idle.setIdle(5); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(5); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      console.log(\`\${this.idleState} \${new Date()}\`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => this.idleState = "TIMED_OUT");
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
  }
}
  `;
  configureComponent = `
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef) {
    // set idle parameters
    idle.setIdle(5); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(5); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      console.log(\`\${this.idleState} \${new Date()}\`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => this.idleState = "TIMED_OUT");
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
  }
}
  `;
  configureUI = `
    <!-- rest of your app omitted for brevity -->
    <div>IDLE_STATE: {{idleState}}, COUNTDOWN: {{countdown}}, LAST_PING: {{lastPing | date}}</div>
    <!-- rest of your app omitted for brevity -->
  `;
  bash = ['bash'];
  typescript = ['typescript'];
  html = ['html'];

  constructor() { }

  ngOnInit(): void {
  }

}
