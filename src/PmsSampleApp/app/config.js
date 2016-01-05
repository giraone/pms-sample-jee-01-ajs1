!function ($, jQuery, window) {
    'use strict';

    app.module.config(
        /**
         * @param $translateProvider
         * @param $logProvider
         */
        function ($translateProvider, $logProvider) {

            // Configure translation
            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/translations/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('de-DE');
            // TODO: This leads to corrupt "umlauts", when using stuff like
            // ng-options="v as ('employeeDetails.nationalityCode.value_' + v) | translate for v in nationalities"
            // $translateProvider.useSanitizeValueStrategy('sanitize');
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

            // Configure logging
            $logProvider.debugEnabled = true;
        }
    );

    app.module.constant(
        'projectConfig', {
            baseUrl: 'api',
            // baseUrl: '/PmsSample/api',
            // baseUrl: 'http://localhost:8080/PmsSample/api',
            // baseUrl: 'http://pmssamplejee01-giraone.rhcloud.com/PmsSample/api',
            // baseUrl: 'http://pmssamplejee1.eu-gb.mybluemix.net/api',

            // catalogBaseUrl: 'http://localhost:8080/CatalogService/api/catalogs'
            catalogBaseUrl: 'http://catalogjee1.eu-gb.mybluemix.net/api/catalogs'
        }
    );

    app.module.run(
        /**
         * @param $rootScope
         * @param $state
         * @param ngNotify
         */
        function ($rootScope, $state, ngNotify) {

            ngNotify.config({
                theme: 'pure',
                position: 'top',
                duration: 3000,
                type: 'info',
                sticky: false,
                html: true
            });

        });

    app.module.config(
        /**
         * @param $httpProvider
         * @param cfpLoadingBarProvider
         */
        function ($httpProvider, cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        });
}();
