!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $document
     * @param $log
     * @param $filter
     * @param {EmployeesResource} EmployeesResource
     * @param document
     */
    function employeeListController($scope, $document, $log, $filter, EmployeesResource) {

        $scope.orderBy = function(predicateName) {
            if (predicateName == $scope.predicate) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.predicate = predicateName;
                $scope.reverse = false;
            }
        };

        $scope.listRefresh = function () {
            $scope.startLoading();
            var oDataFilter = $scope._buildODataFilter($scope.searchFilter);
            EmployeesResource.listAll(100, 0, oDataFilter).$promise.then(function(result) {
                $scope.hasError = false;
                $scope.employees = result;
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeListController.listAll ERROR');
                $scope.hasError = true;
                $scope.employees = [];
                $scope.finishedLoading();
            });
        };

        $scope.searchFilterChanged = function () {
            //$log.debug("employeeListController.searchFilterChanged " + $scope.searchFilter);
            if ($scope.searchFilter.length > 1 || $scope.searchFilter.length < $scope.lastSearchFilter.length)
            {
                $scope.listRefresh();
            }
            $scope.lastSearchFilter = $scope.searchFilter;
        };

        $scope._buildODataFilter = function(userInput)
        {
            // $scope.dateInputFormat = "DD.MM.YYYY";
            $scope.dateInputFormat = $filter('translate')('globals.dateInputFormatMedium');
            // $scope.dateInputFormatRegExp = "[^0-9]*([0-9][0-9]?[.][0-9][0-9]?[.][0-9][0-9][0-9]?[0-9]?)[^0-9]*";
            $scope.dateInputFormatRegExp = $filter('translate')('globals.dateInputFormatMediumRegExp');

            var oDataFilter = null;
            var matchResult;
            var nameMatcher = new RegExp("(\D*)");
            var pnrMatcher = new RegExp("[^0-9]*([0-9][0-9][0-9][0-9][0-9]+)[^0-9]*");
            var dateMatcher = new RegExp($scope.dateInputFormatRegExp);

            if (matchResult = dateMatcher.exec(userInput)) {
                var found = matchResult[1];
                // convert to iso date
                var date = moment(found, $scope.dateInputFormat, /* strict parsing */ false);
                $log.debug('employeeListController._buildODataFilter ' + date);
                if (date.isValid()) {
                    var isoDateString = moment(date).format("YYYYMMDD");
                    $log.debug('employeeListController._buildODataFilter ' + isoDateString);
                    oDataFilter = "dateOfBirth eq '" + isoDateString + "'";
                }
            }
            else if (matchResult = pnrMatcher.exec(userInput)) {
                var found = matchResult[1];
                oDataFilter = "personnelNumber eq '" + found + "'";
            }
            //else if (matchResult = nameMatcher.exec(userInput)) {
            else if (matchResult = nameMatcher.exec(userInput)) {
                var found = userInput; // matchResult[1];
                oDataFilter = "startswith(lastName, '" + found + "') eq true or startswith(firstName, '" + found + "') eq true";
            }
            return oDataFilter;
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
            $scope.predicate = 'personnelNumber';
            $scope.reverse = false;
            $scope.employees = [];
            $scope.searchFilter = "";
            $scope.lastSearchFilter = "";
            $scope.employeesResourceQueryParams = "";
            $scope.loading = false;
                        
            $scope.listRefresh();
        }

        init();
    }

    app.module.controller('employeeListController', employeeListController);
}();