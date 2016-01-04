// IIFE
(function() {
    'use strict';

    angular.module('pms-sample').factory('CatalogResource', catalogResource);

    /**
     * Factory for REST API of catalog service
     * @public
     * @constructor
     *
     * @param projectConfig
     * @param $log
     * @param $resource
     * @param measure
     */
    function catalogResource(projectConfig, $log, $resource, measure) {

        var baseUrl = projectConfig.catalogBaseUrl;
        var version = '1.0';
        var service = {
            getVersion: getVersion,
            listAll: listAll
        };

        return service;

        function getVersion() {
            return version;
        }

        // type: e.g. iso-3166-1-alpha2
        function listAll(type, language) {
            $log.debug('CatalogResource.listAll type=' + type + ',language=' + language);
            var start = measure.now();

            var r = $resource(baseUrl + '/' + type + '/scope-list/' + language + '?orderby=text ASC');
            var result = r.query(function() {
                $log.debug('CatalogResource.listAll result.length=' + ', time=' + measure.diffText(start));
                return result;
            });
            return result;
        }
    }
})();