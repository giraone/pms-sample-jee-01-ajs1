(function() {
    'use strict';

    /**
     * Controller for displaying employess using  paging.
     * @public
     * @constructor
     *
     * @param $scope
     * @param $document
     * @param $log
     * @param $state
     * @param $stateParams
     * @param $filter
     * @param {EmployeesResource} EmployeesResource
     * @param document
     */
    function employeeListController($scope, $window, $document, $log, $state, $stateParams, $filter, $timeout, EmployeesResource) {

        $scope.orderBy = function(predicateName) {
            if (predicateName == $scope.predicate) {
                $stateParams.sortReverse = !$scope.reverse;
            }
            else {
                $stateParams.sortPredicate = predicateName;
                $stateParams.sortReverse = false;
            }
            $state.go('.', $stateParams);        
        };

        $scope.listRefresh = function (append) {
            $scope.startLoading();
            if (!append)
            {
                $stateParams.currentPage = 0;
            }
            var oDataOrderBy = $stateParams.sortPredicate + " " + ($stateParams.sortReverse ? "desc" : "asc");
            var oDataFilter = $scope._buildODataFilter($stateParams.searchFilter.trim());
            $log.debug("oDataFilter = " + oDataFilter);
            EmployeesResource.listBlock($stateParams.itemsPerPage, $stateParams.currentPage * $stateParams.itemsPerPage,
                oDataOrderBy, oDataFilter).$promise.then(function(result) {
                $scope.hasError = false;
                if (append)
                    $scope.employees = $scope.employees.concat(result.blockItems);
                else
                    $scope.employees = result.blockItems;
                $scope.totalCount = result.totalCount;
                
                 $timeout(function() {
                    var b = document.getElementById('mainContent');
                    //$log.debug(b.scrollTop + " " + b.scrollHeight);
                    b.scrollTop = b.scrollHeight;
                }, 1);
                                  
                $scope.finishedLoading();
            }, function (error) {
                $log.debug('employeeListController.listBlock ERROR');
                $scope.hasError = true;
                $scope.employees = [];
                $scope.totalCount = 0;
                $scope.finishedLoading();
            });
        };

        $scope.loadMore = function() {
            $stateParams.currentPage++;
            $state.go('.', $stateParams);
        };

        $scope.nextPageDisabled = function() {
            return $scope.employees.length >= $scope.totalCount;
        };

        $scope.pageCount = function() {
            return Math.ceil($scope.totalCount / $scope.itemsPerPage);
        };
    
        $scope.searchFilterChanged = function () {
            //$log.debug("employeeListController.searchFilterChanged " + $scope.searchFilter);
            if ($scope.searchFilter.length > 1 || $scope.searchFilter.length < $scope.lastSearchFilter.length)
            {
                $stateParams.searchFilter = $scope.searchFilter;
                $state.go('.', $stateParams);
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
            var nameMatcher = new RegExp("[^0-9]+");
            var pnrMatcher = new RegExp("[^0-9]*([0-9][0-9][0-9][0-9][0-9]+)[^0-9]*");
            var costCenterMatcher = new RegExp("[^K0-9]*([K][0-9][0-9][0-9][0-9][0-9]+)[^0-9]*");
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
            else if (matchResult = costCenterMatcher.exec(userInput)) {
                var found = userInput;
                oDataFilter = "costCenter.identification eq '" + found + "'";
            }
            else if (matchResult = pnrMatcher.exec(userInput)) {
                var found = userInput;
                oDataFilter = "personnelNumber eq '" + found + "'";
            }
            else if (matchResult = nameMatcher.exec(userInput)) {
                var found = userInput;
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
            $log.debug("employeeListController.init searchFilter=" + $stateParams.searchFilter + ", currentPage=" + $stateParams.currentPage,
                "sortPredicate=" + $stateParams.sortPredicate + ",sortReverse=" + $stateParams.sortReverse);
            
            $stateParams.currentPage = $stateParams.currentPage ? parseInt($stateParams.currentPage) : 0;
            $stateParams.itemsPerPage = $stateParams.itemsPerPage ? parseInt($stateParams.itemsPerPage) : 10;
            $scope.predicate = $stateParams.sortPredicate = $stateParams.sortPredicate ? $stateParams.sortPredicate : 'personnelNumber';
            $scope.reverse = $stateParams.sortReverse = $stateParams.sortReverse ? ($stateParams.sortReverse == "true") : false;
            $scope.searchFilter = $stateParams.searchFilter = $stateParams.searchFilter ? $stateParams.searchFilter : '';
            
            if ($scope.skip == NaN) $scope.skip = 0;
            
            $scope.hasError = false;
            $scope.smallDevice = isBootstrapDeviceSize('xs'); 
            $scope.bootstrapDeviceSize = getBootstrapDeviceSize();      
            $scope.employees = [];
            $scope.totalCount = 0;         
            $scope.lastSearchFilter = "";
            $scope.employeesResourceQueryParams = "";
            $scope.loading = false;
                        
            $scope.listRefresh(false);
        }

        init();
    }

    app.module.controller('employeeListController', employeeListController);
})();