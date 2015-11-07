!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param { CostCentersResource } CostCentersResource
     * @param { EmployeesResource } EmployeesResource
     */
    function DashboardController($scope, CostCentersResource, EmployeesResource) {

        $scope.costCenterCount = $scope.employeeCount = '?';

        init();

        function init() {
            CostCentersResource.summary().$promise.then(function(result) {
                $scope.costCenterCount = result.count;
            });
            EmployeesResource.summary().$promise.then(function(result) {
                $scope.employeeCount = result.count;
            });
        }
    }

    app.module.controller('dashboardController', DashboardController);
}();