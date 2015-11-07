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
            $translateProvider.useSanitizeValueStrategy('sanitize');

            // Configure logging
            $logProvider.debugEnabled = true;
        }
    );

    app.module.constant(
        'projectConfig', {
            "baseUrl": '/PmsSample/api'
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
