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
     * @param byteSizeDisplayFilter
     * @param $timeout
     * @param Upload
     */
    function employeeDetailController($scope, $window, $document, $log, $state, $stateParams, $translate,
        EmployeesResource, CostCentersResource, CatalogResource, ngNotify, flash, byteSizeDisplayFilter, $timeout, Upload) {

        // construct the base class
        BaseDetailController.call(this, $scope, $document, $log, $translate, ngNotify);
        this.prototype = Object.create(BaseDetailController.prototype);

        // Custom filter for byte size display
        $scope.byteSizeDisplay = byteSizeDisplayFilter();
        
        $scope.employee = $scope.employee || {};
        
        // We cannot use $scope.employee.oid directly, because on an entity update, the selection will not be made
        $scope.employeeCostCenterOid = $scope.employee && $scope.employee.costCenter
            && $scope.employee.costCenter.oid != null ? $scope.employee.costCenter.oid.toString() : null;
            
        // Gender codes
        $scope.genders = ['U', 'M', 'F', 'I'];

        // marital status codes
        $scope.maritalStatusCodes = ['U', 'M', 'W'];
        
        // numberOfChildren codes (plain integer represented as strings)
        $scope.numberOfChildrenCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $scope.numberOfChildrenValue = $scope.employee && $scope.employee.numberOfChildren ? $scope.employee.numberOfChildren.toString() : null;
 
        // ISO 3166-1 alpha-2 country codes for nationality code
        $scope.nationalityCodes = ['DE', 'AT', 'CH', 'IT', 'US'];

        // ISO 3166-1 alpha-2 country codes for country address code
        $scope.countryCodes = ['DE', 'AT', 'CH', 'IT', 'US'];

        // Currently 3166-1 alpha-2 country codes, but should ISO 3166-3 country codes, to have old countries like DDR (code = DDDE)
        // This is the resilent default fallback list only (if service is unavailable, the rest will work)     
        if ($scope.employee && $scope.employee.countryOfBirth)
        {
            $scope.countryOfBirthList = [ { code: $scope.employee.countryOfBirth, text: $scope.employee.countryOfBirth } ];
        }
        else
        {
            $scope.countryOfBirthList = [ { code: 'DE', text: $translate.instant('employeeDetails.countryOfBirth.value_DE') } ];
        }
        $log.debug('#### countryOfBirthList = ' + $scope.countryOfBirthList);

        $scope.selectedTab = $stateParams.currentTab ? $stateParams.currentTab : 0;     
        $scope.selectTab = function (index, reload) {
            if (index == 1 && $scope.employee && $scope.employee.oid && $scope.employee.postalAddresses == null)
            {
                $scope.loadAddresses();
            }
            if (index == 2 && $scope.employee && $scope.employee.oid && $scope.employee.documents == null)
            {
                $scope.loadDocuments();
            }
            $stateParams.currentTab = index;
            // and use the router to change to detail view
            $state.go('^.detail', $stateParams, { "location": true, "reload": reload ? true : false });
        };
        
        // Postal addresses (begin)
        $scope.employee.postalAddresses = null;
        $scope.currentPostalAddressIndex = null;
        // Postal addresses (end)
        
        // Document (begin)
        $scope.employee.documents = null;
        // Documents (end)
          
        $scope.changeNumberOfChildrenValue = function (value) {
            $scope.numberOfChildrenValue = value;         
            // Convert number of children from string to integer
            if ($scope.numberOfChildrenValue == null || "" == $scope.numberOfChildrenValue)
                $scope.employee.numberOfChildren = null;
            else
                $scope.employee.numberOfChildren = parseInt($scope.numberOfChildrenValue);
        }
          
        $scope.changeEmployeeCostCenterOid = function (value) {
            $scope.employeeCostCenterOid = value; 
            // Convert cost center oid from string to integer       
            if ($scope.employee.costCenter)
            {
                $scope.employee.costCenter.oid = parseInt($scope.employeeCostCenterOid);
            }    
            else
            {
                $scope.employee.costCenter = { "oid": parseInt($scope.employeeCostCenterOid) };
            }
        }
        
        $scope.save = function () {
            // Sanity check!
            if (!$scope.employee && !$scope.employee.personnelNumber) {
                return;
            }

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
            $log.debug('loadAddresses wantedOid=' + wantedOid);
            EmployeesResource.listPostalAddresses($scope.employee.oid).$promise.then(function (result) {
                $scope.employee.postalAddresses = result;
                $log.debug('listPostalAddresses = ' + $scope.employee.postalAddresses.length);
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
            if (address.oid)
            {
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
            }
            // This is normally not needed - the address is currently created empty.
            else
            {
                EmployeesResource.addPostalAddress($scope.employee.oid, address).$promise.then(function (result) {
                    ngNotify.set($translate.instant('employeePostalAddress.addSuccess'), 'success');
                    $scope.loadAddresses();
                    $scope.finishedLoading();
                }, function (error) {
                    $log.debug('employeeDetailController.addPostalAddress ERROR');
                    flash.setMessage({
                        'type': 'error',
                        'text': 'Cannot add address of employee ' + $scope.employee.oid + '!'
                    });
                    $scope.finishedLoading();
                });
            }
            
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

        // Documents (begin)
 
        $scope.loadDocuments = function (wantedOid) {
            $log.debug('loadDocuments ' + wantedOid);
            EmployeesResource.listDocuments($scope.employee.oid).$promise.then(function (result) {
                $scope.employee.documents = result;
                $log.debug('listDocuments = ' + $scope.employee.documents.length);
            });
        };
        
        $scope.showDocument = function (documentIndex) {
            var document = $scope.employee.documents[documentIndex];
            var url = EmployeesResource.getDocumentUrl($scope.employee.oid, document.oid);
            $window.location.href = url;
        };
        
        $scope.addDocument = function (businessType, file, errFiles) {
            
            $scope.uploadDocument = file;
            $scope.uploadErrFile = errFiles && errFiles[0];
            
            var mimeType = businessType == "document.contract" ? "application/pdf" : file.type;
            var document = { 'businessType': businessType, 'mimeType': mimeType };          
            
            EmployeesResource.addDocument($scope.employee.oid, document).$promise.then(function (result) {
                file.result = result.location;
                $scope.location = result.location;
               
                // Using HTML5 FileReader
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);               
                fileReader.onload = function(e) {          
                    Upload.http({
                        url: $scope.location + '/content',
                        method: 'PUT',
                        headers: { 'Content-Type': file.type, 'Content-Length': file.size },
                        data: e.target.result
                    }).then(function (response) {
                        $scope.loadDocuments();
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });                  
                };               
            }, function (error) {
                $scope.uploadErrorMsg = error;
            });
        };
        
        $scope.deleteDocument = function (documentIndex) {
            var document = $scope.employee.documents[documentIndex];
            $scope.startLoading();
            EmployeesResource.deleteDocumentById($scope.employee.oid, document.oid).$promise.then(function (result) {
                ngNotify.set($translate.instant('employeeDocument.deleteSuccess'), 'success');
                $scope.loadDocuments();
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeDetailController.deleteDocument ERROR ' + error);
                flash.setMessage({
                    'type': 'error',
                    'text': 'The document with oid ' + document.oid + ' of employee ' + $scope.employee.oid + 'could not be deleted!'
                });
                $scope.finishedLoading();
            });
        };
        
        // Documents (end)
        
        function init() {
             
            $log.debug("employeeDetailController.init currentTab=" + $stateParams.currentTab
                + ", searchFilter=" + $stateParams.searchFilter + ", skip=" + $stateParams.skip);

            $scope.startLoading();

            CatalogResource.listAll('iso-3166-1-alpha2', $translate.instant("language")).$promise.then(
                function (result) {
                    $scope.countryOfBirthList = result;
                }, function (error) {
                    $log.debug('CatalogResource.listAll ERROR');
                }
            );

            CostCentersResource.listAll().$promise.then(function (result) {
                $scope.costCenters = result;
                
                if ($stateParams.employeeId) {

                    EmployeesResource.findById($stateParams.employeeId).$promise.then(function (result) {
                        
                        $scope.employee = result;
                        
                        // Convert number of children from integer to string
                        if ($scope.employee.numberOfChildren != null)
                        {
                            $scope.numberOfChildrenValue = $scope.employee.numberOfChildren.toString();
                        }
                        else
                        {
                            $scope.numberOfChildrenValue = null;
                        }
                        
                        // Now keep the redundant costCenter.oid (integer!) attribute in sync!
                        $scope.employeeCostCenterOid = $scope.employee.costCenter && $scope.employee.costCenter.oid != null ? $scope.employee.costCenter.oid.toString() : null;
                                                         
                        // Now check state params for the wanted tab
                        $scope.selectTab($stateParams.currentTab);
            
                        $log.debug('$scope.employeeCostCenterOid = ' + $scope.employeeCostCenterOid);
                        $log.debug('$scope.numberOfChildrenValue = ' + $scope.numberOfChildrenValue);
            
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