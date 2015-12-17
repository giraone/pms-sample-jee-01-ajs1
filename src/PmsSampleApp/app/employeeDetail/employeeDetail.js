(function() {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $document
     * @param $log
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param {EmployeesResource} EmployeesResource
     * @param {CostCentersResource} CostCentersResource
     * @param ngNotify
     * @param flash
     */
    function employeeDetailController($scope, $document, $log, $state, $stateParams, $translate, EmployeesResource, CostCentersResource, ngNotify, flash) {

        // construct the base class
        BaseDetailController.call(this, $scope, $document, $log, $translate, ngNotify);
        this.prototype = Object.create(BaseDetailController.prototype);
        
        $scope.employee = $scope.employee || {};
        
        // We cannot use $scope.employee directly, because on an entity update, the selection will not be made (1)
        $scope.employeeCostCenterOid = $scope.employee && $scope.employee.costCenter ? $scope.employee.costCenter.oid : null;

        // Gender codes
        $scope.genders = ['U', 'M', 'F', 'I'];

        // marital status codes
        $scope.maritalStatusCodes = ['U', 'M', 'W'];
        
        // numberOfChildren codes (plain integer)
        $scope.numberOfChildrenCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8' , '9'];
        $scope.numberOfChildrenValue = $scope.employee && $scope.employee.numberOfChildren ? $scope.employee.numberOfChildren.toString() : null;
 
        // ISO 3166-1 alpha-2 country codes
        $scope.nationalityCodes = ['DE', 'AT', 'CH', 'IT', 'US'];
 
         // ISO 3166-3 country codes
        $scope.countryOfBirthCodes = ['DE', 'DDDE', 'AT', 'CH', 'IT', 'US'];
                      
        $scope.save = function () {
            // Sanity check!
            if (!$scope.employee && !$scope.employee.personnelNumber) {
                return;
            }

            // Convert number of children from string to integer
            if ($scope.numberOfChildrenValue == null)
                $scope.employee.numberOfChildren = null;
            else
                $scope.employee.numberOfChildren = parseInt($scope.numberOfChildrenValue);
            
            // Now keep the redundant costCenter.oid attribute in sync!
            if ($scope.employee.costCenter)
            {
                $scope.employee.costCenter.oid = $scope.employeeCostCenterOid;
            }    
            else
            {
                $scope.employee.costCenter = { "oid": $scope.employeeCostCenterOid };
            }
            // $log.debug('costCenter new oid = ' + $scope.employee.costCenter.oid);

            var promise;
            var successMessage;
            var errorFunction;
            if ($stateParams.employeeId) {
                promise = EmployeesResource.update($scope.employee).$promise;
                successMessage = 'employeeDetails.successUpdate';
                errorFunction = $scope.showResourceUpdateErrorNotification;
            }
            else {
                promise = EmployeesResource.create($scope.employee).$promise;
                successMessage = 'employeeDetails.successCreate';
                errorFunction = $scope.showResourceCreateErrorNotification;
            }

            $scope.startLoading();
            promise
                .then(function (employeeId) {
                    $scope.showResourceCreateSuccessNotification(successMessage);
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
                    $log.debug('employeeDetailController.save BACK TO LIST ' + $stateParams.searchFilter);
                    $state.go('employees');
                }, errorFunction);
        };

        $scope.cancel = function () {
            //$state.go('employees');
            window.history.back();
        };
        
        function init() {
             
            $log.debug("employeeDetailController.init searchFilter=" + $stateParams.searchFilter + ", skip=" + $stateParams.skip);
            $scope.startLoading();         
            CostCentersResource.listAll().$promise.then(function (result) {
                $scope.costCenters = result;
                
                if ($stateParams.employeeId) {

                    EmployeesResource.findById($stateParams.employeeId).$promise.then(function (result) {
                        $scope.employee = result;
                        // Convert number of children from integer to string
                        if ($scope.employee.numberOfChildren)
                        {
                            $scope.numberOfChildrenValue = $scope.employee.numberOfChildren.toString();
                        }
                        else
                        {
                            $scope.numberOfChildrenValue = null;
                        }
                        
                        // Now keep the redundant costCenter.oid attribute in sync!
                        $scope.employeeCostCenterOid = $scope.employee.costCenter ? $scope.employee.costCenter.oid : null;
                        $scope.finishedLoading();
                    }, function (error) {
                        $log.debug('employeeDetailController.findById ERROR');
                        flash.setMessage({
                            'type': 'error',
                            'text': 'The employee with oid ' + $stateParams.employeeId + ' could not be found!'
                        });
                        $scope.finishedLoading();
                    });
                }
                else {
                    $scope.finishedLoading();
                }
            });        
        }
        
        init();
    }

    app.module.controller('employeeDetailController', employeeDetailController);
})();