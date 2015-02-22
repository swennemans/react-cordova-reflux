# React Reflux with cordova/phonegap

This React starterkit uses: [gulp](https://github.com/gulpjs/gulp), [stylus](https://github.com/LearnBoost/stylus), [webpack](https://github.com/webpack/webpack),
[react-hot-loader](https://github.com/gaearon/react-hot-loader),
[babel](https://github.com/babel/babel) for ES6 syntax and .jsx handling.
[Reflux](https://github.com/spoike/refluxjs) is used for the dataflow and the routing is managed with the [React-Router](https://github.com/rackt/react-router).




provides a prepared development environment based on [gulp](https://github.com/gulpjs/gulp), [stylus](https://github.com/LearnBoost/stylus) and [webpack](https://github.com/webpack/webpack). The internal data flow is handled with [Reflux](https://github.com/spoike/refluxjs) and routing with [React-Router](https://github.com/rackt/react-router).

## Install

Install all dependencies. 

```
$ npm install
```


## Development

### Normal (non-cordova)

Build and serve application
```
$ gulp run

```
Served from: http://localhost:3000/build/index.html#/

### Cordova/phonegap

**Create cordova/phonegap app**

```
$ gulp cordova-create
```

**Run cordova/phonegap server**

Run cordova/phonegap on cordova server for testing your app in [PhoneGap Developer App](http://app.phonegap.com/). Auto-reloads on change. Much slower (approx. 4 seconds) then in normal dev mode.

```
$ gulp run --type cordova
```
Check console log for adress.

**Installing Cordova Plugins**

Add plugin entries at
```
cordova.config.js
```
## App 

**Javascript**

Javascript entry file: `app/scripts/main.js` <br />

**CSS / Stylus**

Uses [Stylus-loader](https://github.com/shama/stylus-loader)
to import Stylus files from your .jsx files.

```
import './style.styl' //ES6 syntax
require('./style.styl)
```

##Credits
Heavenly borrowed from: 
* https://github.com/kjda/ReactJs-Phonegap
* https://github.com/wbkd/react-starterkit