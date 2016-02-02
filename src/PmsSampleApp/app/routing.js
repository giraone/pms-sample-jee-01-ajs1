!function ($, jQuery, document) {
    'use strict';

    app.module.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', getState('dashboard', '/'), false)
            .state('about', getStaticState('about', '/about'), false)
            .state('testPage', getState('testPage', '/testPage'), false)
            .state('testFileUpload', getState('testFileUpload', '/testFileUpload'), false)
            .state('costCenters', getState('costCenterList', '/costCenters'), false)
            .state('costCenters.detail', getState('costCenterDetail', '/:costCenterId'), false)
            .state('employees', getState('employeeList', '/employees?currentPage&itemsPerPage&sortPredicate&sortReverse&searchFilter', true, {
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
            .state('employees.detail', getState('employeeDetail', '/:employeeId?currentTab', true, {
                currentTab: {
                    value: '0',
                    squash: true
                }
            }))
        $urlRouterProvider.otherwise('/');
    });

    function getState(name, url, useFormFactor, params) {
        var templateUrl = 'app/' + name + '/' + name + '.html';
        if (useFormFactor && (window.innerWidth < window.innerHeight))
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
