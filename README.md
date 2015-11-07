# Sample RIA frontend application based on Angular 1.4 and Bootstrap 3

This is an Angular 1.X browser application to be used as a frontend for this ["JEE Kickstart 1  Web Application"](https://github.com/giraone/pms-sample-jee-01).

## Requirements
* [NodeJS](http://nodejs.org) NodeJS
* `npm i -g node-static` Installation of a web server
* Git-Client (GitHub for Desktop)
* WebStorm 10+ or any other suitable IDE 

## Setup
* Download and install [node.js](https://nodejs.org/)
* Download and install an editor of your choice (free: [Visual Studio Code](https://code.visualstudio.com/); commercial: [WebStorm](https://www.jetbrains.com/webstorm/))
 

## Building
The gulp task will build the browser app. To get it working, please do the following:

* Only after cloning the repo: `npm i` within the root folder of this repository
* Live reloads:
  * Run `gulp dev:livereload` to start a live server on localhost:9999 (see `gulpTasks/dev.js` for the port settings), which is best when developing the app.
  * Run `gulp dev:watch` to build automatically all changes.
* Run `gulp` to build all apps in release mode (will execute `gulp build:all:release`)
* Debug Mode: Use the following gulp tasks to build the apps in debug mode
    * Run `gulp build:all` to build all apps in debug mode.
    * Run `gulp dist:default` to build the web app in (and use `static` within the dist/ folder to explore the app).
* Release Mode: Use the following gulp tasks to build the apps in release mode
    * Run `gulp build:all:release` to build all apps in debug mode.
    * Run `gulp dist:release` to build the web app in (and use `static` within the dist/ folder to explore the app).

## Usage
* To login just use username = password (eg. user: test, password: test). 
* If you don't want to use the Web API hosted on *Open Shift*, you can run the server by yourself by starting your JEE application locally and change [change the url](https://github.com/giraone/jee-kickstart01/blob/master/src/PmsSamleApp/app/init.js#L16). The server will run on port 8080.

## Supported platforms
* Any modern web browser (Chrome, Firefox, IE11, Edge, Safari)

## Third-Party Libraries
### JavaScript, CSS
* [AngularJS](https://angularjs.org/), JavaScript framework — *Version 1.4.7*
  * [Angular Translate](https://github.com/angular-translate/angular-translate), i18n for AngularJS applications
  * [Angular Translate Static File Loader](https://github.com/angular-translate/bower-angular-translate-loader-static-files), loading translation from static json files
  * [UI Router](https://github.com/angular-ui/ui-router), new modern AngularJS 1.4+ routing framework
  * [ngResource](https://docs.angularjs.org/api/ngResource), service for REST calls
  * [ngSanitize](https://docs.angularjs.org/api/ngSanitize), service for sanitation
  * [ngAnimate](https://docs.angularjs.org/api/ngAnimate), service for animation
  * [ngNotify](https://github.com/matowens/ng-notify), lightweight module for displaying notifications
  * [Angular Loading Bar](https://chieffancypants.github.io/angular-loading-bar/), an automatic loading bar
* [Bootstrap](http://getbootstrap.com/), responsive layout framework — *Version 3.3.5*
* [AdminLTE](https://almsaeedstudio.com/preview), free responsive dashboard template
  * [Font Awesome](https://fortawesome.github.io/Font-Awesome/), free icon font
  * [jQuery](https://jquery.com/), JavaScript library required for AdminLTE
* [FastClick](https://github.com/ftlabs/fastclick), eliminates the [infamous 300 ms lag on touch devices](http://developer.telerik.com/featured/300-ms-click-delay-ios-8/)
* [Modernizr](https://modernizr.com), feature detection used for date/time fields

## What does this sample show?
* How to call REST (GET, POST, PUT) services using factories build with Angular's `$resource` service from *ngResource*.
* Basic layout (Bootstrap) and input validation (Angular) for input forms.
* Basic routing scenarios (no child routes or dialogs yet!).
* Various usages of `$translate` for building a project with online language switching.
* Basic usage of directives for e.g. date input (`<date>`).
* Drop down boxes with values fetch via REST services.
* Basic usage of *ngNotify* for displaying notifications (success and error messages).
* ...

## Convention and design decisions

### file and folder structure

```

	app/
		config.js
		init.js
		routing.js						// Global routing
		<view-n>						// Folder for every view
			<view-n>.html				// View
			<view-n>.js					// Controller
	assets/
	common/								// Common code - split if projects grows
		controllers/
		directives/
		services/
	css/
	vendor/
		<module-n>/						// Folder for every 2rd party library
			<module-n-version>.js
	index.html

```

To be decided: Use *name.tpl.html* for templates or just *name.html*.

### Controller As syntax (See John Papa "10 AngularJS Patterns")
We use

```

	function MyController(inject1) {
        var vm = this;
		vm.whatever = inject1.method();
	}
```

instead of

```

	function MyController($scope, inject1) {
		$scope.whatever = inject1.method();
	}
```

### $http vs. $resource for REST calls

Currently $resource is used.

### When to display an hour glass or progress bar?

Currently there is only an hour glass in "testpage.html".

### Grid control instead of BootStrap styled HTML table

For a CRUD application with a large numbers of entities and demands for paging and sorting (on the database!) we may need a good implementation of a grid control. Possible candidates: slickgrid, ...

### TypeScript vs. JavaScript

Currently the app is based on JavaScript. T.b.d.: port to TypeScript.

### ngNotify vs. home-made "flashController"

Currently both are used.
