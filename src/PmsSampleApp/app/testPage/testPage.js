!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $log
     * @param { Object } projectConfig
     * @param $resource
     * @param { CostCentersResource } CostCentersResource
     */
    function TestPageController($scope, $log, projectConfig, $resource, CostCentersResource) {

        var baseUrl = projectConfig.baseUrl;

        $scope.selectedTab = 0; //set selected tab to the 1st by default.

        $scope.selectTab = function(index){
            $scope.selectedTab = index;
        }

        $scope.reset = function () {
            $scope.loading = false;
            $scope.neverUsed = true;
            $scope.errorOnLastCall = false;
            $scope.baseUrl = baseUrl;
            $scope.input1 = 'CostCentersResource getVersion()=' + CostCentersResource.getVersion();
            $scope.output1 = '- No results yet -';
        };

        $scope.submit1 = function () {
            $log.debug('submit1', $scope.input1);
            $scope.neverUsed = false;
            $scope.loading = true;

            var resource = $resource(baseUrl + '/costcenters/summary');
            var summary = resource.get(function () {
                $scope.loading = false;
                $log.debug('Success submit1');
                $scope.output1 = "summary.count=" + summary.count;
            });
        };

        $scope.submit2 = function () {
            $log.debug('submit2', $scope.input1);
            $scope.neverUsed = false;
            $scope.loading = true;

            var resource = $resource(baseUrl + '/costcenters');
            var listOfCostCenters = resource.query(function () {
                $scope.loading = false;
                $log.debug('Success submit2');
                $scope.output1 = listOfCostCenters;
            });
        };

        $scope.submit3 = function () {
            $log.debug('submit3', $scope.input1);
            $scope.neverUsed = false;
            $scope.loading = true;

            CostCentersResource.summary().$promise.then(function (result) {
                $scope.loading = false;
                $log.debug('Success submit3');
                $scope.output1 = result.count;
            });
        };

        $scope.submit4 = function () {
            $log.debug('submit4', $scope.input1);
            $scope.neverUsed = false;
            $scope.loading = true;

            CostCentersResource.listAll().$promise.then(function (result) {
                $scope.loading = false;
                $log.debug('listAll OK');
                $scope.output1 = "Items = " + result.length;
                if (result.length > 0)
                    $scope.output1 += " , first=" + result[0].identification;
            }, function (error) {
                $scope.loading = false;
                $log.debug('listAll ERROR');
                $scope.output1 = error;
                $scope.hasError = true;
            });
        };

        $scope.reset();
    }

    app.module.controller('testPageController', TestPageController);
}();