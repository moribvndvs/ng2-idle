# Introduction

[![Join the chat at https://gitter.im/HackedByChinese/ng2-idle](https://badges.gitter.im/HackedByChinese/ng2-idle.svg)](https://gitter.im/HackedByChinese/ng2-idle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Join the chat at https://gitter.im/HackedByChinese/ng2-idle](https://badges.gitter.im/HackedByChinese/ng2-idle.svg)](https://gitter.im/HackedByChinese/ng2-idle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/HackedByChinese/ng2-idle.svg?branch=master)](https://travis-ci.org/HackedByChinese/ng2-idle)

A module for responding to idle users in Angular2 applications. This is a rewrite of the [ng-idle module](https://github.com/HackedByChinese/ng-idle); however if you are using Angular 1, you must use that module.

## License

Authored by **Mike Grabski** @HackedByChinese me@mikegrabski.com

Licensed under MIT

## Design Considerations

The primary application of this module is to detect when users are idle. It can also be used to warn users of an impending timeout, and then time them out. The core of this module is the `Idle` service which does its best - based on your configuration - to detect when a user is active or idle and pass that information on to your application so it can respond appropriately.

### Keepalive Integration

In a common use case where it is used for session management, you may need to signal to the server periodically that the user is still logged in and active. If you need that functionality, `ng2-idle` can **optionally** integrate with [ng2-keepalive](https://github.com/HackedByChinese/ng2-keepalive). `ng2-idle` will instruct `ng2-keepalive` to ping while the user is active, and stop once they go idle or time out. When the user resumes activity or the idle state is reset, it will ping immediately and then resume pinging. **Please note** that keepalive integration is optional, and you must install and configure `ng2-keepalive` separately to get this functionality.

### Example Use Case

For example, consider an email application. For increased security, the application may wish to determine when the user is inactive and log them out, giving them a chance to extend their session if they are still at the computer and just got distracted. Additionally, for even better security the server may issue the user's session a security token that expires after 5 minutes of inactivity. The user may take much more time than that to type out their email and send it. It would be frustrating to find you are logged out when you were actively using the software!

`ng2-idle` can detect that the user is clicking, typing, touching, scrolling, etc. and know that the user is still active. It can work with `ng2-keepalive` to ping the server every few minutes to keep them logged in. In this case, as long as the user is doing something, they stay logged in. If they step away from the computer, we can present a warning dialog, and then after a countdown, log them out.

## Features

TODO

## Getting Started

**NOTE ON ANGULAR**: This module is was written against Angular version `2.0.0-beta.3`. You may run into difficulties installing and running this module with prior versions.

Install and save `ng2-idle` as a dependency of your project.

     npm install ng2-idle

Now you may configure `Idle` as a provider in your app's root `bootstrap` routine, which will make the service instance available across your entire application, include as a local dependency to a route, or make it a local dependency to a component or directive.

TODO

## Developing

**Note** This project was developed using NodeJS 5.5 and NPM 3.3.12. You may experience problems using older versions. Try [NVM](https://github.com/creationix/nvm) or similar to manage different versions of Node concurrently.

This repository uses TypeScript (with Typings as the definition manager), Gulp, tslint, eslint (for JS files used in Gulp tasks), Karma, and Jasmine.

To run Gulp tasks, you'll need to install the `gulp-cli`.

     npm install -g gulp-cli

Once you have cloned the repository, install all packages.

     npm install

You can now build and run tests.

     gulp test

If you want to continuously build and test, first execute this task in a *separate window*:

     gulp build:dev:watch

Then run this task:

     gulp test:watch

If you wish to prepare a branch for a pull request, run this command and fix any errors:

     gulp build

You can use `clang-format` to automatically correct most style errors and then commit the results:

     gulp clang:format

## Contributing

See the [contributing guide](https://github.com/HackedByChinese/ng2-idle/blob/master/CONTRIBUTING.md).
