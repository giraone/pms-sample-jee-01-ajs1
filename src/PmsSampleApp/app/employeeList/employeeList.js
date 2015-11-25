!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
     * @param $scope
     * @param $log
     * @param $filter
     * @param {EmployeesResource} EmployeesResource
     */
    function employeeListController($scope, $log, $filter, EmployeesResource) {

        var vm = $scope;

        vm.orderBy = function(predicateName) {
            if (predicateName == vm.predicate) {
                vm.reverse = !vm.reverse;
            }
            else {
                vm.predicate = predicateName;
                vm.reverse = false;
            }
        };

        vm.listRefresh = function () {
            var oDataFilter = vm._buildODataFilter(vm.searchFilter);
            EmployeesResource.listAll(100, 0, oDataFilter).$promise.then(function(result) {
                vm.hasError = false;
                vm.employees = result;
            }, function (error) {
                $log.debug('employeeListController.listAll ERROR');
                vm.hasError = true;
                vm.employees = [];
            });
        };

        vm.searchFilterChanged = function () {
            //$log.debug("employeeListController.searchFilterChanged " + vm.searchFilter);
            if (vm.searchFilter.length > 1 || vm.searchFilter.length < vm.lastSearchFilter.length)
            {
                vm.listRefresh();
            }
            vm.lastSearchFilter = vm.searchFilter;
        };

        vm._buildODataFilter = function(userInput)
        {
            // vm.dateInputFormat = "DD.MM.YYYY";
            vm.dateInputFormat = $filter('translate')('globals.dateInputFormatMedium');
            // vm.dateInputFormatRegExp = "[^0-9]*([0-9][0-9]?[.][0-9][0-9]?[.][0-9][0-9][0-9]?[0-9]?)[^0-9]*";
            vm.dateInputFormatRegExp = $filter('translate')('globals.dateInputFormatMediumRegExp');

            var oDataFilter = null;
            var matchResult;
            var nameMatcher = new RegExp("(\D*)");
            var pnrMatcher = new RegExp("[^0-9]*([0-9][0-9][0-9][0-9][0-9]+)[^0-9]*");
            var dateMatcher = new RegExp(vm.dateInputFormatRegExp);

            if (matchResult = dateMatcher.exec(userInput)) {
                var found = matchResult[1];
                // convert to iso date
                var date = moment(found, vm.dateInputFormat, /* strict parsing */ false);
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
        }

        function init() {
            vm.hasError = false;
            vm.predicate = 'personnelNumber';
            vm.reverse = false;
            vm.employees = [];
            vm.searchFilter = "";
            vm.lastSearchFilter = "";
            vm.employeesResourceQueryParams = "";

            vm.listRefresh();
        }

        init();
    }

    app.module.controller('employeeListController', employeeListController);
}();