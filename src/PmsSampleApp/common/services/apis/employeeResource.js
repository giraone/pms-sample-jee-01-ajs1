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
            summary: summary,
            listPostalAddresses: listPostalAddresses,
            addPostalAddress: addPostalAddress,
            updatePostalAddress: updatePostalAddress,
            deletePostalAddressById: deletePostalAddressById,
            listDocuments: listDocuments,
            addDocument: addDocument,
            deleteDocumentById: deleteDocumentById,
            getDocumentUrl: getDocumentUrl
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
                $log.debug('EmployeesResource.create result=' + (result ? result.oid : "-"));
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
        
        function listPostalAddresses(employeeOid) {
            $log.debug('EmployeesResource.listPostalAddresses employeeOid=' + employeeOid);
            var r = $resource(baseUrl + '/:employeeOid/addresses', { employeeOid: '@employeeOid' });
            var result = r.query({ employeeOid: employeeOid }, function() {
                $log.debug('EmployeesResource.listPostalAddresses result=' + result);
                return result;
            });
            return result;
        }
        function addPostalAddress(employeeOid, address) {
            $log.debug('EmployeesResource.addPostalAddress employeeOid=' + employeeOid + ', address=' + address);
            var r = $resource(baseUrl + '/:employeeOid/addresses', { employeeOid: '@employeeOid', addressOid: '@addressOid' });
            var result = r.save({ employeeOid: employeeOid }, address, function() {
                $log.debug('EmployeesResource.addPostalAddress result=' + (result ? result.oid : "-"));
                return result;
            });
            return result;
        }
        function updatePostalAddress(employeeOid, address) {
            $log.debug('EmployeesResource.updatePostalAddress employeeOid=' + employeeOid + ', address=' + address);
            var r = $resource(baseUrl + '/:employeeOid/addresses/:addressOid',
                { employeeOid: '@employeeOid', addressOid: '@addressOid' }, { 'update': { method: 'PUT' } }
            );
            var result = r.update({ employeeOid: employeeOid, addressOid: address.oid }, address, function() {
                $log.debug('EmployeesResource.updatePostalAddress result=' + result);
                return result;
            });
            return result;
        }
        function deletePostalAddressById(employeeOid, addressOid) {
            $log.debug('EmployeesResource.deletePostalAddressById employeeOid=' + employeeOid + ', addressOid=' + addressOid);
            var r = $resource(baseUrl + '/:employeeOid/addresses/:addressOid', { employeeOid: '@employeeOid', addressOid: '@addressOid' });
            var result = r.remove({ employeeOid: employeeOid, addressOid: addressOid }, function() {
                $log.debug('EmployeesResource.deletePostalAddressById result=' + result);
                return result;
            });
            return result;
        }
        
        function listDocuments(employeeOid) {
            $log.debug('EmployeesResource.listDocuments employeeOid=' + employeeOid);
            var r = $resource(baseUrl + '/:employeeOid/documents', { employeeOid: '@employeeOid' });
            var result = r.query({ employeeOid: employeeOid }, function() {
                $log.debug('EmployeesResource.listDocuments result=' + result);
                return result;
            });
            return result;
        }
        function addDocument(employeeOid, document) {
            $log.debug('EmployeesResource.addDocument employeeOid=' + employeeOid + ', document=' + document);
            var r = $resource(baseUrl + '/:employeeOid/documents', { employeeOid: '@employeeOid', documentOid: '@documentOid' });
            var result = r.save({ employeeOid: employeeOid }, document, function() {
                $log.debug('EmployeesResource.addDocument result=' + (result ? result.oid : "-"));
                return result;
            });
            return result;
        }
        function deleteDocumentById(employeeOid, documentOid) {
            $log.debug('EmployeesResource.deleteDocumentById employeeOid=' + employeeOid + ', documentOid=' + documentOid);
            var r = $resource(baseUrl + '/:employeeOid/documents/:documentOid', { employeeOid: '@employeeOid', documentOid: '@documentOid' });
            var result = r.remove({ employeeOid: employeeOid, documentOid: documentOid }, function() {
                $log.debug('EmployeesResource.deleteDocumentById result=' + result);
                return result;
            });
            return result;
        }
        function getDocumentUrl(employeeOid, documentOid) {
            return baseUrl + '/' + employeeOid + '/documents/' + documentOid + '/content';
        }
    }
})();