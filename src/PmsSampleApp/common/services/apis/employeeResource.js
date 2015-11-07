// IIFE
(function() {
    'use strict';

    angular.module('pms-sample').factory('EmployeesResource', employeesResource);

    function employeesResource(projectConfig, $log, $resource) {

        var baseUrl = projectConfig.baseUrl + '/employees';
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
        function listAll() {
            $log.debug('EmployeesResource.listAll');
            var r = $resource(baseUrl);
            var result = r.query(function() {
                $log.debug('EmployeesResource.listAll result.length=' + result.length);
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