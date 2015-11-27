!function ($, jQuery, window, document) {
    'use strict';

    /**
     * FlashController (toast messages) from JBoss Forge scaffolding
     * @constructor
     * @public
     *
     * @param $scope
     * @param flash
     */

    function FlashController($scope, flash) {
        $scope.flash = flash;
        $scope.showAlert = false;

        $scope.$watch('flash.getMessage()', function(newVal) {
            var message = newVal;
            if(message && message.text) {
                $scope.showAlert = message.text.length > 0;
            } else {
                $scope.showAlert = false;
            }
        });

        $scope.hideAlert = function() {
            $scope.showAlert = false;
        }
    }

    app.module.controller('flashController', ['$scope','flash', FlashController]);
}();