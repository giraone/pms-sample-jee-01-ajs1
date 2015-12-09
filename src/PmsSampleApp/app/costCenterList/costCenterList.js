!function ($, jQuery, window, document) {
    'use strict';

    /**
     * Controller for displaying all cost centers (no paging!)
     * @public
     * @constructor
     *
     * @param $scope
     * @param $document
     * @param $log
     * @param {CostCentersResource} CostCentersResource
     */
    function costCenterListController($scope, $document, $log, CostCentersResource) {

        $scope.listRefresh = function () {
            $scope.startLoading();
            CostCentersResource.listAll(100, 0).$promise.then(function(result) {
                $log.debug('costCenterListController.listAll OK');
                $scope.hasError = false;
                $scope.costCenters = result;
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('costCenterListController.listAll ERROR ' + error);
                $scope.hasError = true;
                $scope.costCenters = [];
                $scope.finishedLoading();
            });
        };
        
        $scope.orderBy = function(predicateName) {
            if (predicateName == $scope.predicate) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.predicate = predicateName;
                $scope.reverse = false;
            }
        };
        
        $scope.startLoading = function() {
            $document[0].body.style.cursor='wait';
            $scope.loading = true;
        };
        
        $scope.finishedLoading = function() {
            $document[0].body.style.cursor='default';
            $scope.loading = false;
        };
        

        function init() {
            $scope.hasError = false;
            $scope.predicate = 'identification';
            $scope.reverse = false;
            $scope.costCenters = [];
            $scope.loading = false;
            
            $scope.listRefresh();
        }
        
        init();
    }

    app.module.controller('costCenterListController', costCenterListController);
}();