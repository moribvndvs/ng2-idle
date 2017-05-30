<a name="2.0.0-beta.12"></a>
# [2.0.0-beta.12](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2017-05-30)


### Bug Fixes

* **idle:** use expiry.now() if expiry.last() returns null ([06fcb36](https://github.com/HackedByChinese/ng2-idle/commit/06fcb36)), closes [#54](https://github.com/HackedByChinese/ng2-idle/issues/54)



<a name="2.0.0-beta.11"></a>
# [2.0.0-beta.11](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2017-04-14)

### Refactor

* updated imports of rxjs to only import the operators and types used.

<a name="2.0.0-beta.10"></a>
# [2.0.0-beta.10](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2017-03-30)


### Chores

* **deps**: support Angular 4 in addition to Angular 2

<a name="2.0.0-beta.9"></a>
# [2.0.0-beta.9](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2017-03-20)


### Bug Fixes

* **idle:** check expiry on timeout doCountdown ([e23233d](https://github.com/HackedByChinese/ng2-idle/commit/e23233d))



<a name="2.0.0-beta.8"></a>
# [2.0.0-beta.8](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2017-02-20)


### Bug Fixes

* Initialize localStorage idling value to false in constructor ([ab71433](https://github.com/HackedByChinese/ng2-idle/commit/ab71433))



<a name="2.0.0-beta.7"></a>
# [2.0.0-beta.7](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2017-02-16)


### Bug Fixes

* **core:** check expiry before toggling idle state ([6702c36](https://github.com/HackedByChinese/ng2-idle/commit/6702c36)), closes [#37](https://github.com/HackedByChinese/ng2-idle/issues/37)



<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2017-02-14)


### Bug Fixes

* AutoResume.notIdle with LocalStorageExpiry wasn't working well ([935ade9](https://github.com/HackedByChinese/ng2-idle/commit/935ade9))
* bugfix when last() with null value throws exception ([5b3d175](https://github.com/HackedByChinese/ng2-idle/commit/5b3d175))



<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2017-02-09)

The new default expiry is now LocalStorageExpiry, and StorageInterruptSource has been added to the default module providers. This in effect makes idle coordination between tabs the new default (rather than `SimpleExpiry`). This makes the defaults more like the original `ng-idle`. You can of course override the `IdleExpiry` provider and go back to `SimpleExpiry` or use your own. Special thanks to @rousseaufiliong for porting that functionality.

### Features

* prevent timing out one tab or window if another tab have activity ([#33](https://github.com/HackedByChinese/ng2-idle/issues/33)) ([3ab086d](https://github.com/HackedByChinese/ng2-idle/commit/3ab086d))



<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2016-12-02)

## License

* **LICENSE** change license to Apache-2.0 ([f8caa10](https://github.com/HackedByChinese/ng2-idle/commit/f8caa10))

<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2016-11-21)


### Features

* **aot:** add AOT support ([cc99199](https://github.com/HackedByChinese/ng2-idle/commit/cc99199))



<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/HackedByChinese/ng2-idle/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2016-11-15)


### Bug Fixes

* **core, keepalive:** emit helpers for es5 compatibility ([ed30b6b](https://github.com/HackedByChinese/ng2-idle/commit/ed30b6b))



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.18...v2.0.0-beta.1) (2016-11-14)


### Code Refactoring

* **core:** modularize core ([3f0868a](https://github.com/HackedByChinese/ng2-idle/commit/3f0868a))


### Features

* **keepalive:** merge ng2-idle-keepalive into [@ng](https://github.com/ng)-idle/keepalive ([7702d9d](https://github.com/HackedByChinese/ng2-idle/commit/7702d9d))


### BREAKING CHANGES

* keepalive: Modules have been changed from Ng2IdleModule and Ng2IdleKeepaliveModule to NgIdleModule and NgIdleKeepaliveModule, respectively. Additionally, keepalive imports should now be @ng-idle/keepalive.
* core: This repository has been refactored to follow the @angular model of modularization so that it can be maintained more easily. You will need to change your import statements from 'ng2-idle' to '@ng-idle/core'.



<a name="1.0.0-alpha.18"></a>
# [1.0.0-alpha.18](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2016-11-04)


### Features

* **module:** add Ng2IdleModule ([b0d6372](https://github.com/HackedByChinese/ng2-idle/commit/b0d6372)), closes [#3](https://github.com/HackedByChinese/ng2-idle/issues/3) [#10](https://github.com/HackedByChinese/ng2-idle/issues/10) [#22](https://github.com/HackedByChinese/ng2-idle/issues/22) [#23](https://github.com/HackedByChinese/ng2-idle/issues/23) [#24](https://github.com/HackedByChinese/ng2-idle/issues/24)

### BREAKING CHANGES

This change removes the core.ts. Instead, you should create an app module using `NgModule` and import the new `Ng2IdleModule`.

* Change any `import ... from 'ng2-idle/core';` to `import ... from 'ng2-idle';`
* Create an AppModule using `NgModule` if you haven't already. `NgModule` was added in Angular2 RC.5
* Use `Ng2Module.forRoot()` in your app module's `imports` declaration.

Example:

**app.module.ts**
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2IdleModule } from 'ng2-idle';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2IdleModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**app.component.ts**
```
import { Component } from '@angular/core';

import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private idle: Idle) {
    // initialize idle here.
  }
}
```

<a name="1.0.0-alpha.17"></a>
# [1.0.0-alpha.17](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2016-11-02)

### Chores

* **deps**: relax angular dependencies to minor version


<a name="1.0.0-alpha.16"></a>
# [1.0.0-alpha.16](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2016-09-19)

### Chores

* **deps**: update to angular@2.0.0


<a name="1.0.0-alpha.15"></a>
# [1.0.0-alpha.15](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2016-08-23)

### Bug Fixes

* **release:**: incorrect publishing


<a name="1.0.0-alpha.14"></a>
# [1.0.0-alpha.14](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2016-08-23)

**DEPRECATED**

### Chores

* **deps**: update to angular 2.0.0-rc.5


<a name="1.0.0-alpha.13"></a>
# [1.0.0-alpha.13](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2016-06-30)


### Chores

* **deps**: update to angular 2.0.0-rc.4

<a name="1.0.0-alpha.12"></a>
# [1.0.0-alpha.12](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2016-06-22)
Update to Angular 2.0.0-rc.3



<a name="1.0.0-alpha.11"></a>
# [1.0.0-alpha.11](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2016-05-09)


### BREAKING CHANGES
This release targets Angular2 RC.1. Angular2 RC.0 introduced breaking changes to how Angular is packaged. You will need to upgrade your application to RC.0 or later for this version of ng2-idle to work.

<a name="1.0.0-alpha.10"></a>
# [1.0.0-alpha.10](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2016-04-06)


### Bug Fixes

* **Idle:** do not pause interrupts when idle ([d8d600d](https://github.com/HackedByChinese/ng2-idle/commit/d8d600d)), closes [#4](https://github.com/HackedByChinese/ng2-idle/issues/4) [#5](https://github.com/HackedByChinese/ng2-idle/issues/5)



<a name="1.0.0-alpha.9"></a>
# [1.0.0-alpha.9](https://github.com/HackedByChinese/ng2-idle/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2016-03-25)


### Bug Fixes

* **typings:** add ambient dev dependencies for es6-shim ([1a6fe2a](https://github.com/HackedByChinese/ng2-idle/commit/1a6fe2a))



<a name="1.0.0-alpha.8"></a>
# [1.0.0-alpha.8](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.7...v1.0.0-alpha.8) (2016-03-25)


### Bug Fixes

* **dependencies:** update to target Angular 2.0.0-beta.12 ([37bf7ad](https://github.com/HackedByChinese/ng2-idle/commit/37bf7ad))



<a name="1.0.0-alpha.7"></a>
# [1.0.0-alpha.7](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.6...v1.0.0-alpha.7) (2016-02-24)


### Features

* **EventTargetInterruptSource:** target events can be throttled over a specified duration ([174d2d0](https://github.com/HackedByChinese/ng2-idle/commit/174d2d0))

### Performance Improvements

* **Idle:** interrupts are detached when state is idle or not running ([e0b2a1e](https://github.com/HackedByChinese/ng2-idle/commit/e0b2a1e))



<a name="1.0.0-alpha.6"></a>
# [1.0.0-alpha.6](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.5...v1.0.0-alpha.6) (2016-02-16)


### Features

* **IdleExpiry:** add extensible timeout expiry support ([31be875](https://github.com/HackedByChinese/ng2-idle/commit/31be875))



<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.4...v1.0.0-alpha.5) (2016-02-16)


### Bug Fixes

* **Idle:** immediately ping and resume keepalive upon interrupting idle state ([62b47b2](https://github.com/HackedByChinese/ng2-idle/commit/62b47b2))



<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.3...v1.0.0-alpha.4) (2016-02-16)


### Bug Fixes

* **EventTargetInterruptSource:** subscribing to multiple events separated by space no longer breaks ([c552d07](https://github.com/HackedByChinese/ng2-idle/commit/c552d07))
* **Idle:** setKeepaliveEnabled(false) no longer stops keepalive ([050a590](https://github.com/HackedByChinese/ng2-idle/commit/050a590))



<a name="1.0.0-alpha.3"></a>
# [1.0.0-alpha.3](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.2...v1.0.0-alpha.3) (2016-02-16)


### Bug Fixes

* **Build:** exclude postinstall task when installing production ([1db53ca](https://github.com/HackedByChinese/ng2-idle/commit/1db53ca))



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/HackedByChinese/ng2-idle/compare/1.0.0-alpha.1...v1.0.0-alpha.2) (2016-02-16)


### Features

* **Keepalive:** implements optional keepalive integration ([5a727dd](https://github.com/HackedByChinese/ng2-idle/commit/5a727dd))



<a name="1.0.0-alpha.1"></a>
# 1.0.0-alpha.1 (2016-02-11)


### Features

* **Idle:** add service with basic features ([6db5d50](https://github.com/HackedByChinese/ng2-idle/commit/6db5d50))
