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

    FastClick.attach(document.body);
}();
