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

        function init() {
            $scope.hasError = false;
            $scope.predicate = 'identification';
            $scope.reverse = false;
            $scope.costCenters = [];

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

        $scope.orderBy = function(predicateName) {
            if (predicateName == $scope.predicate) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.predicate = predicateName;
                $scope.reverse = false;
            }
        };
    }

    app.module.controller('costCenterListController', costCenterListController);
}();