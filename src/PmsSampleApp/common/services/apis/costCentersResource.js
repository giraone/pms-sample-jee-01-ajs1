// IIFE
(function() {
    'use strict';

    angular.module('pms-sample').factory('CostCentersResource', costCentersResource);

    /**
     * Factory for cost center REST API
     * @public
     * @constructor
     *
     * @param projectConfig
     * @param $log
     * @param $resource
     * @param measure
     */
    function costCentersResource(projectConfig, $log, $resource, measure) {

        var baseUrl = projectConfig.baseUrl + '/costcenters';
        var version = "1.0";
        var service = {
            getVersion: getVersion,
            findById: findById,
            listAll: listAll,
            create: create,
            update: update,
            deleteById: deleteById,
            summary: summary
        };
        var paramDef = {top:'@top', skip:'@skip',filter:'@filter'};
        
        return service;

        function getVersion() {
            return version;
        }
        function findById(oid) {
            $log.debug('CostCentersResource.findById oid=' + oid);
            var r = $resource(baseUrl + '/:oid', { oid: '@oid' });
            var result = r.get({ oid: oid }, function() {
                $log.debug('CostCentersResource.findById result=' + result);
                return result;
            });
            return result;
        }
        function listAll(top, skip, filter) {
            $log.debug('CostCentersResource.listAll top=' + top + ',skip=' + skip + ',filter=' + filter);
            var start = measure.now();

            var queryParam = {};
            if (top) queryParam.top = top;
            if (skip) queryParam.skip = skip;
            if (filter) queryParam.filter = filter;
            var r = $resource(baseUrl, paramDef);
            var result = r.query(queryParam, function() {
                $log.debug('CostCentersResource.listAll result.length=' + ", time=" + measure.diffText(start));
                return result;
            });
            return result;
        }
        function create(entity) {
            $log.debug('CostCentersResource.create entity=' + entity);
            var r = $resource(baseUrl);
            var result = r.save(entity, function() {
                $log.debug('CostCentersResource.create result=' + result);
                return result;
            });
            return result;
        }
        function update(entity) {
            $log.debug('CostCentersResource.update entity=' + entity);
            var r = $resource(baseUrl + '/:oid', null,  {
                'update': { method: 'PUT' }
            });
            var result = r.update({ oid: entity.oid }, entity, function() {
                $log.debug('CostCentersResource.create result=' + result);
                return result;
            });
            return result;
        }
        function deleteById(oid) {
            $log.debug('CostCentersResource.deleteById oid=' + oid);
            var r = $resource(baseUrl + '/:oid', { oid: '@oid' });
            var result = r.remove({ oid: entity.oid }, function() {
                $log.debug('CostCentersResource.deleteById result=' + result);
                return result;
            });
            return result;
        }
        function summary() {
            $log.debug('CostCentersResource.summary');
            var r = $resource(baseUrl + '/summary');
            var result = r.get(function() {
                $log.debug('CostCentersResource.summary result=' + result.count);
                return result;
            });
            return result;
        }
    }
})();