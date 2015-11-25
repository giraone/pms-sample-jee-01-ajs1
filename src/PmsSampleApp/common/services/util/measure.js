'use strict';

angular.module('pms-sample').factory('measure', ['$rootScope', function ($rootScope) {

    return {
        now: function () {
            return performance.now();
        },
        diff: function (start) {
            return performance.now() - start;
        },
        diffText: function (start) {
            return (performance.now() - start).toFixed(1) + " ms";
        },
    };
}]);

