# Introduction
[![Join the chat at https://gitter.im/HackedByChinese/ng2-idle](https://badges.gitter.im/HackedByChinese/ng2-idle.svg)](https://gitter.im/HackedByChinese/ng2-idle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/HackedByChinese/ng2-idle.svg?branch=master)](https://travis-ci.org/HackedByChinese/ng2-idle)

A module for responding to idle users in Angular2 applications. This is a rewrite of the [ng-idle module](https://github.com/HackedByChinese/ng-idle); however if you are using Angular 1, you must use that module.

## License
Authored by **Mike Grabski** @HackedByChinese me@mikegrabski.com

Licensed under MIT

## Design Considerations
The primary application of this module is to detect when users are idle. It can also be used to warn users of an impending timeout, and then time them out. The core of this module is the `Idle` service which does its best - based on your configuration - to detect when a user is active or idle and pass that information on to your application so it can respond appropriately.

### Extensible Keepalive Integration
In a common use case where it is used for session management, you may need to signal to the server periodically that the user is still logged in and active. If you need that functionality, `ng2-idle` can **optionally** integrate with [ng2-idle-keepalive](https://github.com/HackedByChinese/ng2-idle-keepalive). `ng2-idle` will instruct `ng2-idle-keepalive` to ping while the user is active, and stop once they go idle or time out. When the user resumes activity or the idle state is reset, it will ping immediately and then resume pinging. **Please note** that keepalive integration is optional, and you must install and configure `ng2-idle-keepalive` separately to get this functionality. You can implement your own by extending `KeepaliveSvc` and configuring it as a provider in your application for the `KeepaliveSvc` class.

### Extensible Interrupts
An interrupt is any source of input (typically from the user, but could be things like other tabs or an event) that can be used to signal to `Idle` that the idle watch should be interrupted or reset. Unlike `ng-idle`, these sources are not hardcoded; you can extend `InterruptSource` or any of the built-in sources to suit your purposes. This feature is also useful to handle input noise that may plague your particular use case. It can also be used to target specific elements on a page rather than the whole document or window. The following sources come built into this package:
- `InterruptSource` (abstract): A base type you can implement to make your own source.
- `EventTargetInterruptSource`: Any object that implements `EventTarget`, such as an `HTMLElement` or `Window`. Takes in the object that is the source and a space delimited string containing the events that cause an interrupt.
- `DocumentInterruptSource`: Looks for events (in a space delimited string) that bubble up to the `document.documentElement` (`html` node).
- `WindowInterruptSource`: Looks for events (in a space delimited string) that bubble up to the `Window`.

**NOTE**: You must configure source(s) yourself when you initialize the application. By default, no interrupts are configured. You can use a configuration analogous to the `ng-idle` default by importing `DEFAULT_INTERRUPTSOURCES` and passing that reference to `Idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);`.

### Extensible Expiry
Another feature ported from `ng-idle` is the ability to store an expiry value in some store where multiple tabs or windows running the same application can write to. Commonly, this store is the `localStorage`, but could be cookies or whatever you want. The purpose of this expiry and the expiry store is twofold: First, to prevent a window from not timing out if it sleeps or pauses longer than the configured timeout period. Second, it can be used so that activity in one tab or window prevents other tabs or windows in the same application from timing out.

By default, a `SimpleExpiry` type is provided, which will just keep track of the expiry in memory. It will fulfill the first purpose mentioned above, but it will not fulfill the second. In other words, `SimpleExpiry` does not coordinate last activity between tabs or windows; you'll need to use or create an implementation that supports that. An official implementation of that using `localStorage` is forthcoming. You can create your own by extending `IdleExpiry` or `SimpleExpiry` and configuring it as a provider for the `IdleExpiry` class.

**NOTE** An `IdleExpiry` implementation must be configured. If you don't care about or need this functionality, just use the default `SimpleExpiry` (this is included in `IDLE_PROVIDERS`).

### Multiple Idle Instance Support
The dependency injector in Angular 2 supports a hierarchical injection strategy. This allows you to create an instance of `Idle` at whatever scope you need, and there can be more than one instance. This allows you two have two separate watches, for example, on two different elements on the page.

### Example Use Case
For example, consider an email application. For increased security, the application may wish to determine when the user is inactive and log them out, giving them a chance to extend their session if they are still at the computer and just got distracted. Additionally, for even better security the server may issue the user's session a security token that expires after 5 minutes of inactivity. The user may take much more time than that to type out their email and send it. It would be frustrating to find you are logged out when you were actively using the software!

`ng2-idle` can detect that the user is clicking, typing, touching, scrolling, etc. and know that the user is still active. It can work with `ng2-idle-keepalive` to ping the server every few minutes to keep them logged in. In this case, as long as the user is doing something, they stay logged in. If they step away from the computer, we can present a warning dialog, and then after a countdown, log them out.

## Getting Started
**NOTE ON ANGULAR**: This module is was written against Angular version `2.0.0-beta.12`. You may run into difficulties installing and running this module with prior versions.

**NOTE ON KEEPALIVE**: Keepalive is now an optional module available [here](https://github.com/HackedByChinese/ng2-idle-keepalive). See the [README](https://github.com/HackedByChinese/ng2-idle-keepalive#getting-started) on how to integrate both ng2-idle _and_ ng2-idle-keepalive.

First, install and save `ng2-idle` as a dependency of your project.

```
 npm install ng2-idle
```

Now you may configure `Idle` as a provider in your app's root `bootstrap` routine, which will make the service instance available across your entire application, include as a local dependency to a route, or make it a local dependency to a component or directive.

As an example: let's assume we have an application with this structure (omitting boilerplate, project artifacts, build tasks, etc.):

```
.
└── src
    ├── app
    │   └── components
    │       ├── app.css
    │       ├── app.e2e.ts
    │       ├── app.html
    │       ├── app.ts
    │       └── app.spec.ts
    ├── home
    │   └── components
    │       ├── home.css
    │       ├── home.html
    │       ├── home.ts
    │       ├── home.e2e.ts
    │       └── home.spec.ts
    ├── main.ts
    └── index.html

```

In `src/main.ts`, we bootstrap the application. It might look something like this:

```
import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http'; // You'll need to import HTTP providers
import {IDLE_PROVIDERS} from 'ng2-idle/core'; // Import idle providers

// If you're using keepalive and expiry modules, you'll need to import those providers, too.
// Refer to those modules for more details.

import {AppCmp} from './app/components/app'; // include your root application component

bootstrap(AppCmp, [
  // registers Idle
  IDLE_PROVIDERS
  // any additional providers your application needs
]);
```

In `src/app/components/app.ts`, we inject `Idle` and configure it for our application. This single instance of `Idle` will be used in all dependency hierarchies below the root (unless you choose to override them).

```
import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core';

import {HomeCmp} from '../../home/components/home';
import {AboutCmp} from '../../about/components/about';

@Component({
  selector: 'app',
  templateUrl: './app/components/app.html',
  styleUrls: ['./app/components/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/about', component: AboutCmp, as: 'About' }
])
export class AppCmp {

  // when this component is loaded, Idle will be injected, configured, and start watching for idleness.
  constructor(private idle: Idle) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Subscribe to idle events. Add your logic on how the application should respond, such as displaying
    // a warning dialog onIdleStart, or redirecting to logout page onTImeout, etc.
    idle.onIdleStart.subscribe(() => {
      console.log('IdleStart');
    });
    idle.onIdleEnd.subscribe(() => {
      console.log('IdleEnd');
    });
    idle.onTimeoutWarning.subscribe((countdown:number) => {
      console.log('TimeoutWarning: ' + countdown);
    });
    idle.onTimeout.subscribe(() => {
      console.log('Timeout');
    });

    // start watching for idleness right away.
    idle.watch();
  }
}
```

## Developing
**Note** This project was developed using NodeJS 5.5 and NPM 3.3.12. You may experience problems using older versions. Try [NVM](https://github.com/creationix/nvm) or similar to manage different versions of Node concurrently.

This repository uses TypeScript (with Typings as the definition manager), Gulp, tslint, eslint (for JS files used in Gulp tasks), Karma, and Jasmine.

To run Gulp tasks, you'll need to install the `gulp-cli`.

```
 npm install -g gulp-cli
```

Once you have cloned the repository, install all packages.

```
 npm install
```

You can now build and run tests.

```
 gulp test
```

If you want to continuously build and test, first execute this task in a _separate window_:

```
 gulp build:dev:watch
```

Then run this task:

```
 gulp test:watch
```

If you wish to prepare a branch for a pull request, run this command and fix any errors:

```
 gulp build
```

You can use `clang-format` to automatically correct most style errors and then commit the results:

```
 gulp clang:format
```

## Contributing
See the [contributing guide](https://github.com/HackedByChinese/ng2-idle/blob/master/CONTRIBUTING.md).
