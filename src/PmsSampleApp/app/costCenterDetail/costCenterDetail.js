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
     * @param {CostCentersResource} CostCentersResource
     * @param ngNotify
     * @param flash
     */
    function CostCenterDetailController($scope, $log, $state, $stateParams, $translate, CostCentersResource, ngNotify, flash) {

        init();

        $scope.costCenter = $scope.costCenter || {};

        function init() {
            if ($stateParams.costCenterId) {

                CostCentersResource.findById($stateParams.costCenterId).$promise.then(function(result) {
                    $log.debug('costCenterDetailController.findById OK');
                    $scope.costCenter = result;
                }, function (error) {
                    $log.debug('costCenterListController.findById ERROR');
                    flash.setMessage({'type': 'error', 'text': 'The cost center with oid ' + $stateParams.costCenterId + ' could not be found!'});
                });
            }
        }

        $scope.save = function () {
            // Sanity check!
            if (!$scope.costCenter && !$scope.costCenter.identification) {
                return;
            }
            var promise;
            var successMessage;
            if ($stateParams.costCenterId) {
                promise = CostCentersResource.update($scope.costCenter).$promise;
                successMessage = 'costCenterDetails.successUpdate';
            }
            else {
                promise = CostCentersResource.create($scope.costCenter).$promise;
                successMessage = 'costCenterDetails.successCreate';
            }

            promise
                .then(function (costCenterId) {
                    ngNotify.set($translate.instant(successMessage), 'success');

                    if (!$stateParams.costCenterId) {
                        $scope.costCenter.id = costCenterId;
                        $state.go('.', {
                            costCenterId: costCenterId
                        }, {
                            reload: false,
                            notify: false
                        });
                    }
                }, showErrorNotification);
        };

        $scope.cancel = function () {
            $state.go('costCenters');
        }

        function showErrorNotification() {
            ngNotify.set($translate.instant('common.requestError'), 'error');
        }
    }

    app.module.controller('costCenterDetailController', CostCenterDetailController);
}();
