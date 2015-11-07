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

        $scope.genders = ['U', 'M', 'I', 'I'];

        $scope.nationalities = ['DEU', 'ITA', 'USA'];

        CostCentersResource.listAll().$promise.then(function (result) {
            $scope.costCenters = result;
        });

        // We cannot ... part (2), therefore we have to watch
        $scope.$watch(
            "$scope.employeeCostCenterOid",
            function handleCostCenterOidChange (newValue, oldValue) {
                $log.debug('handleCostCenterOidChange newValue=' + newValue);
                if ($scope.employee.costCenter)
                    $scope.employee.costCenter.oid = newValue;
                else
                    $scope.employee.costCenter = { "oid": newValue };
            }
        );

        function init() {
            if ($stateParams.employeeId) {

                EmployeesResource.findById($stateParams.employeeId).$promise.then(function (result) {
                    $log.debug('employeeDetailController.findById OK');
                    $scope.employee = result;
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

                    if (!$stateParams.employeeId) {
                        $scope.employee.id = employeeId;
                        $state.go('.', {
                            employeeId: employeeId
                        }, {
                            reload: false,
                            notify: false
                        });
                    }
                }, showErrorNotification);
        };

        $scope.cancel = function () {
            $state.go('employees');
        }

        function showErrorNotification() {
            ngNotify.set($translate.instant('common.requestError'), 'error');
        }
    }

    app.module.controller('employeeDetailController', employeeDetailController);
}();
