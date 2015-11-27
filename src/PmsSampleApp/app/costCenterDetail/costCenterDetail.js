!function ($, jQuery, window, document) {
    'use strict';

    /**
     * Controller for creating or editing cost centers
     * @public
     * @constructor
     *
     * @param $scope
     * @param $document
     * @param $log
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param {CostCentersResource} CostCentersResource
     * @param ngNotify
     * @param flash
     */
    function CostCenterDetailController($scope, $document, $log, $state, $stateParams, $translate,
                                        CostCentersResource, ngNotify, flash) {

        
        // construct the base class
        BaseDetailController.call(this, $scope, $document, $log, $translate, ngNotify);
        this.prototype = Object.create(EditViewController.prototype);
        
        $scope.costCenter = $scope.costCenter || {};

        $scope.save = function () {
            // Sanity check!
            if (!$scope.costCenter && !$scope.costCenter.identification) {
                return;
            }
                       
            var promise;
            var successMessage;
            var errorFunction;
            if ($stateParams.costCenterId) {
                promise = CostCentersResource.update($scope.costCenter).$promise;
                successMessage = 'costCenterDetails.successUpdate';
                errorFunction = $scope.showResourceUpdateErrorNotification;
            }
            else {
                promise = CostCentersResource.create($scope.costCenter).$promise;
                successMessage = 'costCenterDetails.successCreate';
                errorFunction = $scope.showResourceCreateErrorNotification;
            }

            $scope.startLoading();  
            promise
                .then(function (costCenterId) {
                    $scope.showResourceCreateSuccessNotification(successMessage);
                    // Stay and reload
                    /*
                    if (!$stateParams.costCenterId) {
                        $scope.costCenter.oid = costCenterId;
                        $state.go('.', {
                            costCenterId: costCenterId
                        }, {
                            reload: false,
                            notify: false
                        });

                    }
                    */
                    // Back to list
                    $log.debug('costCenterDetailController.save BACK TO LIST');
                    $state.go('costCenters');
                }, errorFunction);
        };

        $scope.cancel = function () {
            $state.go('costCenters');
        };
                
        function init() {
                        
            if ($stateParams.costCenterId) {

                $scope.startLoading();              
                CostCentersResource.findById($stateParams.costCenterId).$promise.then(function(result) {
                    $log.debug('costCenterDetailController.findById OK');
                    $scope.costCenter = result;
                    $scope.finishedLoading();
                }, function (error) {
                    $log.debug('costCenterListController.findById ERROR ' + error);
                    flash.setMessage({'type': 'error', 'text': 'The cost center with oid ' + $stateParams.costCenterId + ' could not be found!'});
                    $scope.finishedLoading();
                });
            }
        }
        
        init();
    }

    app.module.controller('costCenterDetailController', CostCenterDetailController);
}();
