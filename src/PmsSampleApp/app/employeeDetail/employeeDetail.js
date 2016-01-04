!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $window
     * @param $document
     * @param $log
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param {EmployeesResource} EmployeesResource
     * @param {CostCentersResource} CostCentersResource
     * @param {CatalogResource} CatalogResource
     * @param ngNotify
     * @param flash
     */
    function employeeDetailController($scope, $window, $document, $log, $state, $stateParams, $translate, EmployeesResource, CostCentersResource, CatalogResource, ngNotify, flash) {

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
 
        // ISO 3166-1 alpha-2 country codes for nationality code
        $scope.nationalityCodes = ['DE', 'AT', 'CH', 'IT', 'US'];

        // ISO 3166-1 alpha-2 country codes for country address code
        $scope.countryCodes = ['DE', 'AT', 'CH', 'IT', 'US'];

         // ISO 3166-3 country codes - NO MORE USED - replaced by countryOfBirthList
        $scope.countryOfBirthCodes = ['DE', 'DDDE', 'AT', 'CH', 'IT', 'US'];
        
        $scope.countryOfBirthList = null;

        // Postal addresses (begin)
        $scope.employee.postalAddresses = null;
        $scope.currentPostalAddressIndex = null;
        $scope.selectedTab = $stateParams.currentTab ? $stateParams.currentTab : 0;
        $scope.selectTab = function (index) {
            $log.debug('Change tab to ' + index);
            if ($scope.selectedTab == 1 && $scope.employee && $scope.employee.oid && $scope.employee.postalAddresses == null)
            {
                $scope.loadAddresses();
            }
            $stateParams.currentTab = index;
            // and use the router to change to detail view
            $state.go('^.detail', $stateParams, { "location": true, "reload": true });
        };
        // Postal addresses (end)

                      
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
            $log.debug('employeeCostCenterOid = ' + $scope.employeeCostCenterOid);
            if ($scope.employee.costCenter)
            {
                $scope.employee.costCenter.oid = $scope.employeeCostCenterOid;
            }    
            else
            {
                $scope.employee.costCenter = { "oid": $scope.employeeCostCenterOid };
            }
            $log.debug('costCenter new oid = ' + $scope.employee.costCenter.oid);

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
                    $state.go('employees', $stateParams, { "location": true });
                    //$window.history.back();
                }, errorFunction);
        };

        $scope.cancel = function () {
            $log.debug('employeeDetailController.save BACK TO LIST ' + $stateParams.searchFilter);
            $state.go('employees', $stateParams, { "location": true });
            //$window.history.back();
        };

        // Postal addresses (begin)

        $scope.loadAddresses = function (wantedOid) {
            EmployeesResource.listPostalAddresses($scope.employee.oid).$promise.then(function (result) {
                $scope.employee.postalAddresses = result;
                if ($scope.employee.postalAddresses.length > 0)
                {
                    $scope.currentPostalAddressIndex = 0;
                    if (wantedOid)
                    {
                        result.forEach(function (v, i) {
                            if (wantedOid == v) $scope.currentPostalAddressIndex = i });
                    }
                }
                else
                {
                    $scope.currentPostalAddressIndex = null;
                }
            });
        };

        $scope.refreshAddresses = function () {
            var currentAddressOid = null;
            if ($scope.employee && $scope.employee.postalAddresses && $scope.currentPostalAddressIndex != null)
            {
                currentAddressOid = $scope.employee.postalAddresses[$scope.currentPostalAddressIndex].oid;
            }
            $scope.loadAddresses(currentAddressOid);
        };

        $scope.showAddress = function (addressIndex) {
            $scope.currentPostalAddressIndex = addressIndex;
        };

        $scope.addAddress = function () {
            var ranking = 1;
            if ($scope.employee.postalAddresses)
            {
                ranking = $scope.employee.postalAddresses.length + 1;
            }
            var address = {
                ranking: ranking,
                countryCode: "DE"
            };
            $scope.startLoading();
            EmployeesResource.addPostalAddress($scope.employee.oid, address).$promise.then(function (result) {
                ngNotify.set($translate.instant('employeePostalAddress.addSuccess'), 'success');
                $scope.loadAddresses();
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeDetailController.addPostalAddress ERROR');
                flash.setMessage({
                    'type': 'error',
                    'text': 'Cannot add new address to employee ' + $scope.employee.oid + '!'
                });
                $scope.finishedLoading();
            });
        };

        $scope.saveAddress = function () {
            $scope.startLoading();
            var address = $scope.employee.postalAddresses[$scope.currentPostalAddressIndex];
            EmployeesResource.updatePostalAddress($scope.employee.oid, address).$promise.then(function (result) {
                ngNotify.set($translate.instant('employeePostalAddress.updateSuccess'), 'success');
                $scope.loadAddresses();
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeDetailController.savePostalAddress ERROR');
                flash.setMessage({
                    'type': 'error',
                    'text': 'Cannot save address of employee ' + $scope.employee.oid + '!'
                });
                $scope.finishedLoading();
            });
        };

        $scope.deleteAddress = function (addressIndex) {
            var address = $scope.employee.postalAddresses[addressIndex];
            $scope.startLoading();
            EmployeesResource.deletePostalAddressById($scope.employee.oid, address.oid).$promise.then(function (result) {
                ngNotify.set($translate.instant('employeePostalAddress.deleteSuccess'), 'success');
                $scope.loadAddresses();
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeDetailController.deleteAddress ERROR');
                flash.setMessage({
                    'type': 'error',
                    'text': 'The address with oid ' + address.oid + ' of employee ' + $scope.employee.oid + 'could not be deleted!'
                });
                $scope.finishedLoading();
            });
        };

        // Postal addresses (end)

        function init() {
             
            $log.debug("employeeDetailController.init currentTab=" + $stateParams.currentTab
                + ", searchFilter=" + $stateParams.searchFilter + ", skip=" + $stateParams.skip);

            $scope.startLoading();

            CatalogResource.listAll('iso-3166-1-alpha2', $translate.instant("language")).$promise.then(function (result) {
                $scope.countryOfBirthList = result;
            });

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
}();