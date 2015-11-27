// No IIFE, we need it globally - See http://blog.mgechev.com/2013/12/18/inheritance-services-controllers-in-angularjs/#comment-1986333469
/**
* BaseDetailController is a base class for controllers of CRUD edit views.
* It offers loading indicators: busy cursor, loading toggle (boolean))
* @constructor
* @public
*
* @param $scope
* @param $document
* @param $log
* @param $translate
* @param ngNotify
*/
function BaseDetailController($scope, $document, $log, $translate, ngNotify) {

    $scope.startLoading = function() {
        
        $document[0].body.style.cursor='wait';
        $scope.loading = true;
    };
            
    $scope.finishedLoading = function() {
        $log.debug('BaseDetailController.finishedLoading');
        $document[0].body.style.cursor='default';
        $scope.loading = false;
    };
    
    $scope.showResourceCreateSuccessNotification = function(message) {
        ngNotify.set($translate.instant(message), 'success');
        $scope.finishedLoading();    
    };
    
    $scope.showResourceCreateErrorNotification = function(error) {
        $log.debug('BaseDetailController.showResourceErrorNotification ' + error);
        var message;
        if (error.status == 409) {
            message = $translate.instant('common.requestErrorConflict');
        }
        else {
            message = $translate.instant('common.requestError');
        }
        ngNotify.set(message, 'error');
        $scope.finishedLoading(); 
    };
    
    $scope.showResourceUpdateErrorNotification = function(error) {
        $log.debug('BaseDetailController.showResourceUpdateErrorNotification ' + error);
        var message;
        if (error.status == 409) {
            message = $translate.instant('common.requestErrorConflict');
        }
        else {
            message = $translate.instant('common.requestError');
        }
        ngNotify.set(message, 'error');
        $scope.finishedLoading(); 
    };
    
    function init() {           
        $scope.loading = false;
    }
    
    init();
}