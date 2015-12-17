!function ($, jQuery, document) {
    'use strict';

    app.module.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', getState('dashboard', '/'))
            .state('about', getStaticState('about', '/about'))
            .state('testPage', getState('testPage', '/testPage'))
            .state('costCenters', getState('costCenterList', '/costCenters'))
            .state('costCenters.detail', getState('costCenterDetail', '/:costCenterId'))
            .state('employees', getState('employeeList', '/employees?skip&predicate&reverse&searchFilter', false, {
                currentPage: {
                    value: '0',
                    squash: true
                },
                itemsPerPage: {
                    value: '10',
                    squash: true
                },
                sortPredicate: {
                    value: '',
                    squash: true
                },
                sortReverse: {
                    value: '',
                    squash: true
                },
                searchFilter: {
                    value: '',
                    squash: true
                }
            }))
            .state('employees.detail', getState('employeeDetail', '/:employeeId?skip&predicate&reverse&searchFilter', true))
        $urlRouterProvider.otherwise('/');
    });

    function getState(name, url, useFormFactor, params) {
        var templateUrl = 'app/' + name + '/' + name + '.html';
        if (useFormFactor && window.innerWidth < window.innerHeight)
        {
            templateUrl = 'app/' + name + '/' + name + '-portrait.html';
        }
        return {
            url: url || '/' + name,
            params: params,
            views: {
                'main@': {
                    templateUrl: templateUrl,
                    controller: name + 'Controller',
                    //controllerAs: name
                }
            }
        };
    }
    
    function getStaticState(name, url) {
        return {
            url: url || '/' + name,
            views: {
                'main@': {
                    templateUrl: 'app/' + name + '/' + name + '.html',
                }
            }
        };
    }
}();
