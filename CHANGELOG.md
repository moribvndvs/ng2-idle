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
