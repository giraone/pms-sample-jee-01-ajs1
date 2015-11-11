'use strict';

//var DATE_REGEX = /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])$/;
angular.module('pms-sample').directive('date', function ($parse, dateFilter, $translate, $log) {
    return {
        restrict: "E",
        replace: true,
        transclude: false,
        require: '?ngModel',
        compile: function (element, attrs) {
            var modelAccessor = $parse(attrs.ngModel);

            var isRequired = "";
            if (attrs.required) {
                isRequired = "required";
            }
            var dateInput = "DD.MM.YYYY";
            $translate('globals.dateInputFormatMedium').then(function (text) {
                dateInput = text;
            });
            var dateOutput = dateInput;

            var html = "<input id='" + attrs.id + "' name='" + attrs.name + "' type='date' " + isRequired + " class='form-control' placeholder='" + attrs.placeholder + "'></input>";

            var $newElem = $(html);
            element.replaceWith($newElem);

            var nativeLinker = function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) return;

                var dateParser = function (value) {
                    $log.debug("dateParserN " + value);
                    var date;
                    if (value) {
                        date = new Date(Date.parse(value));
                    } else {
                        date = value;
                    }
                    return date;
                }
                var dateFormatter = function (value) {
                    $log.debug("dateFormatterN " + value);
                    if (value) {
                        //var date = dateFilter(value, "yyyy-MM-dd");
                        var date = moment(value).format("YYYY-MM-DD");
                        return date;
                    }
                    return;
                }

                ngModelCtrl.$parsers.unshift(dateParser);
                ngModelCtrl.$formatters.unshift(dateFormatter);

                element.bind("blur keyup change", function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.val());
                    });
                });

                ngModelCtrl.$render = function () {
                    element.val(ngModelCtrl.$viewValue);
                }
            }

            var enhancedLinker = function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) return;

                var dateParser = function (value) {
                    $log.debug("dateParserE " + value);
                    if (value) {
                        // Parse using moment.js
                        var date = moment(value, dateInput);
                        if (date.isValid())
                        {
                            ngModelCtrl.$setValidity("dateFormat", true);
                            return date;
                        /*
                        var d = value.match(DATE_REGEX);
                        if (d) {
                            var formattedDate = d[1] + "-" + d[2] + "-" + d[3];
                            var date = new Date(Date.parse(formattedDate));
                            ngModelCtrl.$setValidity("dateFormat", true);
                            return date;
                        */
                        } else {
                            ngModelCtrl.$setValidity("dateFormat", false);
                            return;
                        }
                    }
                    return;
                }
                var dateFormatter = function (value) {
                    $log.debug("dateParserE " + value);
                    if (value) {
                        //var date = dateFilter(value, "yyyy-MM-dd");
                        var date = moment(value).format(dateOutput);
                        return date;
                    }
                    return;
                }

                ngModelCtrl.$parsers.unshift(dateParser);
                ngModelCtrl.$formatters.unshift(dateFormatter);

                element.bind("blur keyup change", function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.val());
                    });
                });

                ngModelCtrl.$render = function () {
                    element.val(ngModelCtrl.$viewValue);
                }
            }

            $log.debug("Modernizr inputtypes.date=" + Modernizr.inputtypes["date"]);
            if (Modernizr.inputtypes["date"]) {
                return nativeLinker;
            } else {
                return enhancedLinker;
            }
        }
    }
});