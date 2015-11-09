!function ($, jQuery) {
    'use strict';

    window.app = window.app || {};
    window.app.module = angular.module('pms-sample', [
        'ui.router',
        'pascalprecht.translate',
        'ngResource',
        'ngSanitize',
        'ngNotify',
        'angular-loading-bar',
        'ngAnimate'
    ]);

    // insert the base URL for test page here
    // app.module.constant('apiBaseUrl', 'http://localhost:8080/PmsSample/');
    app.module.constant('apiBaseUrl', 'http://pmssamplejee01-giraone.rhcloud.com/PmsSample/');

    FastClick.attach(document.body);
}();
