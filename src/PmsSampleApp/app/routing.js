!function ($, jQuery, window, document) {
    'use strict';

    app.module.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', getState('dashboard', '/'))
            .state('testPage', getState('testPage', '/testPage'))
            .state('costCenters', getState('costCenterList', '/costCenters'))
            .state('costCenters.detail', getState('costCenterDetail', '/:costCenterId'))
            .state('employees', getState('employeeList', '/employees'))
            .state('employees.detail', getState('employeeDetail', '/:employeeId'))
        $urlRouterProvider.otherwise('/');
    });

    function getState(name, url) {
        return {
            url: url || '/' + name,
            views: {
                'main@': {
                    templateUrl: 'app/' + name + '/' + name + '.html',
                    controller: name + 'Controller'
                    //controllerAs: 'vm'
                }
            }
        };
    }
}();
