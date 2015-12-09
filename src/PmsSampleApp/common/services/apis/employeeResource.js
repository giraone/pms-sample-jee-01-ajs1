// IIFE
(function() {
    'use strict';

    angular.module('pms-sample').factory('EmployeesResource', employeesResource);

    /**
     * Factory for employee REST API
     * @public
     * @constructor
     *
     * @param projectConfig
     * @param $log
     * @param $resource
     * @param measure
     */
    function employeesResource(projectConfig, $log, $resource, measure) {

        var baseUrl = projectConfig.baseUrl + '/employees';
        var version = "1.0";
        var service = {
            getVersion: getVersion,
            findById: findById,
            listBlock: listBlock,
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
            $log.debug('EmployeesResource.findById oid=' + oid);
            var r = $resource(baseUrl + '/:oid', { oid: '@oid' });
            var result = r.get({ oid: oid }, function() {
                $log.debug('EmployeesResource.findById result=' + result);
                return result;
            });
            return result;
        }
        function listBlock(top, skip, orderby, filter) {
            $log.debug('EmployeesResource.listBlock top=' + top + ',skip=' + skip + ',orderby=' + orderby + ',filter=' + filter);
            var start = measure.now();

            var queryParam = {};
            if (top) queryParam.top = top;
            if (skip) queryParam.skip = skip;
            if (orderby) queryParam.orderby = orderby;
            if (filter) queryParam.filter = filter;
            var r = $resource(baseUrl, paramDef);
            var result = r.get(queryParam, function() {
                $log.debug('EmployeesResource.listBlock result.totalCount=' + result.totalCount
                    + ', result.blockItems.length=' + result.blockItems.length + ", time=" + measure.diffText(start));
                return result;
            });
            return result;
        }
        function create(entity) {
            $log.debug('EmployeesResource.create entity=' + entity);
            var r = $resource(baseUrl);
            var result = r.save(entity, function() {
                $log.debug('EmployeesResource.create result=' + result);
                return result;
            });
            return result;
        }
        function update(entity) {
            $log.debug('EmployeesResource.update entity=' + entity);
            var r = $resource(baseUrl + '/:oid', null,  {
                'update': { method: 'PUT' }
            });
            var result = r.update({ oid: entity.oid }, entity, function() {
                $log.debug('EmployeesResource.create result=' + result);
                return result;
            });
            return result;
        }
        function deleteById() {
            $log.debug('EmployeesResource.deleteById oid=' + oid);
            var r = $resource(baseUrl + '/:oid', { oid: '@oid' });
            var result = r.remove({ oid: entity.oid }, function() {
                $log.debug('EmployeesResource.deleteById result=' + result);
                return result;
            });
            return result;
        }
        function summary() {
            $log.debug('EmployeesResource.summary');
            var r = $resource(baseUrl + '/summary');
            var result = r.get(function() {
                $log.debug('EmployeesResource.summary result=' + result.count);
                return result;
            });
            return result;
        }
    }
})();