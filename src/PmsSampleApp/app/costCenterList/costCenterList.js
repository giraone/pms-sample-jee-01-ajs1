!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $log
     * @param {CostCentersResource} CostCentersResource
     */
    function costCenterListController($scope, $log, CostCentersResource) {

        init();

        $scope.orderBy = function(predicateName) {
            if (predicateName == $scope.predicate) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.predicate = predicateName;
                $scope.reverse = false;
            }
        };

        function init() {
            $scope.hasError = false;
            $scope.predicate = 'oid';
            $scope.reverse = false;
            $scope.costCenters = null;

            CostCentersResource.listAll().$promise.then(function(result) {
                $log.debug('costCenterListController.listAll OK');
                $scope.hasError = false;
                $scope.costCenters = result;
            }, function (error) {
                $log.debug('costCenterListController.listAll ERROR');
                $scope.hasError = true;
                $scope.costCenters = [];
            });
        }
    }

    app.module.controller('costCenterListController', costCenterListController);
}();