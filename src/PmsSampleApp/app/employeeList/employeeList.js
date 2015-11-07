!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $log
     * @param {EmployeesResource} EmployeesResource
     */
    function employeeListController($scope, $log, EmployeesResource) {

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

            EmployeesResource.listAll().$promise.then(function(result) {
                $log.debug('employeeListController.listAll OK');
                $scope.hasError = false;
                $scope.employees = result;
            }, function (error) {
                $log.debug('employeeListController.listAll ERROR');
                $scope.hasError = true;
                $scope.employees = [];
            });
        }
    }

    app.module.controller('employeeListController', employeeListController);
}();