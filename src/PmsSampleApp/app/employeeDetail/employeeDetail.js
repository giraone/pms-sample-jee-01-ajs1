!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $log
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param {EmployeesResource} EmployeesResource
     * @param {CostCentersResource} CostCentersResource
     * @param ngNotify
     * @param flash
     */
    function employeeDetailController($scope, $log, $state, $stateParams, $translate, EmployeesResource, CostCentersResource, ngNotify, flash) {

        init();

        $scope.employee = $scope.employee || {};
        // We cannot use $scope.employee directly, because on an entity update, the selection will not be made (1)
        $scope.employeeCostCenterOid = $scope.employee && $scope.employee.costCenter ? $scope.employee.costCenter.oid : null;

        $scope.genders = ['U', 'M', 'F', 'I'];

        // ISO 3166-1 alpha-3 country codes
        $scope.nationalities = ['DEU', 'AUT', 'CHE', 'ITA', 'USA'];

        CostCentersResource.listAll().$promise.then(function (result) {
            $scope.costCenters = result;
        });

        function init() {
            if ($stateParams.employeeId) {

                EmployeesResource.findById($stateParams.employeeId).$promise.then(function (result) {
                    $scope.employee = result;
                    // Now keep the redundant costCenter.oid attribute in sync!
                    $scope.employeeCostCenterOid = $scope.employee.costCenter.oid;
                }, function (error) {
                    $log.debug('employeeDetailController.findById ERROR');
                    flash.setMessage({
                        'type': 'error',
                        'text': 'The employee with oid ' + $stateParams.employeeId + ' could not be found!'
                    });
                });
            }
        }

        $scope.save = function () {
            // Sanity check!
            if (!$scope.employee && !$scope.employee.personnelNumber) {
                return;
            }

            // Now keep the redundant costCenter.oid attribute in sync!
            if ($scope.employee.costCenter)
                $scope.employee.costCenter.oid = $scope.employeeCostCenterOid;
            else
                $scope.employee.costCenter = { "oid": $scope.employeeCostCenterOid };

            var promise;
            var successMessage;
            if ($stateParams.employeeId) {
                promise = EmployeesResource.update($scope.employee).$promise;
                successMessage = 'employeeDetails.successUpdate';
            }
            else {
                promise = EmployeesResource.create($scope.employee).$promise;
                successMessage = 'employeeDetails.successCreate';
            }

            promise
                .then(function (employeeId) {
                    ngNotify.set($translate.instant(successMessage), 'success');
                    // Stay and reload
                    /*
                    if (!$stateParams.employeeId) {
                        $scope.employee.oid = employeeId;
                        $state.go('.', {
                            employeeId: employeeId
                        }, {
                            reload: false,
                            notify: false
                        });
                    }
                    */
                    // Back to list
                    $log.debug('employeeDetailController.save BACK TO LIST');
                    $state.go('employees');
                }, showErrorNotification);
        };

        $scope.cancel = function () {
            //$log.debug('employeeDetailController.cancel');
            $state.go('employees');
        }

        function showErrorNotification() {
            ngNotify.set($translate.instant('common.requestError'), 'error');
        }
    }

    app.module.controller('employeeDetailController', employeeDetailController);
}();
