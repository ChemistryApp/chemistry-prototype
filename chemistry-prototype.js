'use strict';

/**
 * @ngdoc overview
 * @name chemistryApp.chemistryPrototype
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('chemistryApp.chemistryPrototype', [
    'ui.router'
])

    /**
     * @ngdoc overview
     * @name appWindow
     *
     * @description
     * An application window directive that simulates an iPad.
     */
    .directive('appWindow', function () {
        return {
            scope: {},
            restrict: 'E',
            transclude: true,
            template: '<div class="app-holder"><div class="app-container" ng-transclude></div></div>',
            controller: function($scope) {
                this.setSidebar = function(sidebar) {
                    $scope.sidebar = sidebar;
                };
                this.setActionPanel = function(actionPanel) {
                    $scope.actionPanel = actionPanel;
                };
            }
        };
    })

    /**
     * @ngdoc overview
     * @name sidebar
     *
     * @description
     * Renders the sidebar of the application that allows for navigation links to be added.
     */
    .directive('sidebar', function () {
        return {
            require: ['^appWindow', 'sidebar'],
            scope: {},
            templateUrl: '<header><div class="image"></div></header><div class="sidebar-content" ng-transclude></div>',
            restrict: 'E',
            transclude: true,
            controller: function($scope) {
                this.setSidebarAvatar = function (sidebarAvatar) {
                    $scope.sidebarAvatar = sidebarAvatar;
                };
                this.setSidebarLinks = function (sidebarLinks) {
                    $scope.sidebarLinks = sidebarLinks;
                };
            },
            link: function (scope, element, attributes, controllers) {
                var windowController = controllers[0];
                windowController.setSidebar();
            }
        };
    })

    /**
     * @ngdoc overview
     * @name actionPanel
     *
     * @description
     * While the sidebar is placed on the left, the actionPanel resides on the right where the screen's content appears.
     */
    .directive('actionPanel', function () {
        return {
            require: ['^appWindow', 'actionPanel'],
            scope: {},
            template: '<div class="action-panel"><div class="inner-container" ng-transclude></div></div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: function ($scope) {

            },
            link: function (scope, element, attributes, controllers) {
                var windowController = controllers[0];
                windowController.setActionPanel();
            }
        };
    })

    /**
     * @ngdoc overview
     * @name linkList
     *
     * @description
     * The wrapper for the links that appear within the sidebar.
     */
    .directive('linkList', function () {
        return {
            require: ['^sidebar', 'linkList'],
            scope: {},
            restrict: 'E',
            template: '<div class="link-list" ng-transclude></div>',
            transclude: true,
            controller: function ($scope) {
                var links = [];
                this.addLink = function (link) {
                    links.push(link);
                };
                this.getSidebarLinks = function () {
                    return links;
                };
            },
            link: function (scope, element, attributes, controllers) {
                var sidebarController = controllers[0];
                sidebarController.setSidebarLinks();
            }
        };
    })

    /**
     * @ngdoc overview
     * @name link
     *
     * @description
     * Creates a navigation item within the sidebar to be able to navigate within the application
     */
    .directive('link', ['$state', '$rootScope', function ($state, $rootScope) {
        return {
            require: ['^linkList', 'link'],
            scope: {
                text: '@',
                state: '@'
            },
            restrict: 'E',
            template: '<a href="#/{{ state }}" title="{{ text }}" class="link {{ state && $root.$state.current.name === state ? \'active\' : \'\'}}">{{ text }}</a>',
            replace: true,
            controller: function ($scope) {

            },
            link: function (scope, element, attributes, controllers) {

            }
        };
    }])

    /**
     * @ngdoc overview
     * @name sidebarAvatar
     *
     * @description
     * A UI element that appears at the bottom of the sidebar accompanied by a name and image
     */
    .directive('sidebarAvatar', function () {
        return {
            require: ['^sidebar', 'sidebarAvatar'],
            scope: {
                name: '@',
                position: '@',
                image: '@'
            },
            template: '<div class="inner-wrapper"><div class="avatar"><img src="{{ photo ? photo : \'/images/luke-bettis.jpg\' }}" /></div><div class="name">{{ name ? name : \'Luke Bettis\' }}<br />{{ position ? position : \'SO Admin\' }}</div></div>',
            restrict: 'E',
            transclude: true,
            controller: function($scope) {

            },
            link: function(scope, element, attributes, controllers) {
                var sidebarController = controllers[0];
                sidebarController.setSidebarAvatar();
            }
        };
    })

    /**
     * @ngdoc overview
     * @name searchBar
     *
     * @description
     * A search bar input that allows live searching
     */
    .directive('searchBar', function () {
        return {
            template: '<div class="search-bar" ng-class="searchValue.length >= 1 ? \'active\' : \'\'">' +
                            '<form>' +
                                '<div class="input-group">' +
                                    '<input type="text" class="search-field" ng-model="searchValue" />' +
                                '</div>' +
                                '<button type="button" class="cancel-button" ng-click="searchValue = \'\'">' +
                                    'Cancel' +
                                '</button>' +
                            '</form>' +
                        '</div>',
            scope: {
                searchValue: '='
            },
            replace: true,
            restrict: 'EA'
        };
    })

    /**
     * @ngdoc overview
     * @name fieldAppend
     *
     * @description
     * A binding event that appends string content to a field or value
     */
    .directive('fieldAppend', function () {
        return {
            restrict: 'A',
            scope: {
                textToAppend: '@',
                scopeVariable: '='
            },
            link: function(scope, element, attrs) {
                element.bind('click', function () {
                    var content = attrs.textToAppend;
                    if (scope.scopeVariable) {
                        scope.scopeVariable = scope.scopeVariable + content + ' ';
                    } else {
                        scope.scopeVariable = content + ' ';
                    }
                    scope.$apply();
                });
            }
        };
    })

    /**
     * @ngdoc overview
     * @name iconBlock
     *
     * @description
     * An clickable icon block
     */
    .directive('iconBlock', function () {
        return {
            restrict: 'EA',
            scope: {
                isButton: '=',
                isActive: '=',
                scopeVariable: '=',
                icon: '@'
            },
            template: '<div class="icon-block" ng-class="{\'is-button\' : isButton,\'active\' : isActive}" ng-click="toggleButton(scopeVariable)">' +
                            '<div class="icon-mount">' +
                                '<i class="icon {{ icon ? icon : \'ion-email\'"></i>' +
                            '</div>' +
                            '<div class="label">' +
                                '6/18/15<br />' +
                                'Friday Meeting' +
                            '</div>' +
                        '</div>',
            replace: true,
            link: function (scope, element, attrs) {
                scope.toggleButton = function () {
                    scope.scopeVariable = !scope.scopeVariable;
                    if (scope.isButton && !scope.isActive) {
                        scope.isActive = true;
                    } else if (scope.isButton && scope.isActive) {
                        scope.isActive = false;
                    }
                }
            }
        };
    })

    /**
     * @ngdoc overview
     * @name chartTabs
     *
     * @description
     * Builds automated tab system that can hold images or charts
     */
    .directive('chartTabs', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            template: '<div class="chart-tabs" ng-transclude></div>',
            require: 'chartTabs',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                activeTab: '='
            },
            controller: function ($scope) {
                var tabs = [];
                this.addTab = function (tab) {
                    tabs.push(tab);
                };
                this.getTabs = function () {
                    $scope.tabs = tabs;
                    $scope.buildTabs();
                };
            },
            link: function (scope, element, attrs, tabsController) {
                scope.chartHeight = '200';
                scope.chartWidth = '300';

                $timeout(function () {
                    tabsController.getTabs();
                }, 1000);

                scope.buildTabs = function () {
                    scope.activeTab = scope.tabs[0].id;
                    scope.tabBroadcast(scope.activeTab);

                    var tabs = '';
                    angular.forEach(scope.tabs, function (value, key) {
                        tabs += '<div class="tab" ng-click="showTab(\'' + value.id + '\')" ng-class="activeTab == \'' + value.id + '\' ? \'active\' : \'\'">' + value.chartLabel + '</div>';
                    });
                    element.prepend($compile('<div class="tabs">' + tabs + '</div>')(scope));
                };

                scope.showTab = function (tab) {
                    scope.activeTab = String(tab);
                    scope.tabBroadcast(tab);
                };

                scope.tabBroadcast = function (tab) {
                    scope.$broadcast('activeTab', {
                        data: tab
                    });
                };

            }
        };
    }])

    /**
     * @ngdoc overview
     * @name chartTab
     *
     * @description
     * A content holder that resides within the chartTabs directive
     */
    .directive('chartTab', ['$compile', function ($compile) {
        return {
            template: '<div class="chart-tab" ng-show="activeTab === chartId"></div>',
            require: '^chartTabs',
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                chartId: '@',
                chartTitle: '@',
                chartData: '=',
                chartType: '@',
                source: '@',
                imageNumber: '@'
            },
            link: function (scope, element, attributes, tabsController) {
                var template;

                if (scope.source === 'image') {
                    template = '<img src="images/charts/chart-' + scope.chartType + '-' + scope.imageNumber + '.png" alt="' + scope.chartTitle + ' chart" title="' + scope.chartTitle + '" />';
                } else if (scope.source === 'chart') {
                    template = '<chart chart-id="' + scope.chartId + '" title="' + scope.chartTitle + '" height="200" width="200" chart-data="' + scope.chartData + '" chart-type="' + scope.chartType + '"></chart>';
                }
                $compile(template)(scope);
                angular.element(element).html(template);

                tabsController.addTab({
                    id: attributes.chartId,
                    chartTitle: attributes.chartTitle,
                    chartLabel: attributes.label
                });

                scope.$on('activeTab', function (e, tab) {
                    scope.activeTab = tab.data;
                });
            }
        };
    }])

    /**
     * @ngdoc overview
     * @name monogramLetters
     *
     * @description
     * A basic filter that creates the abbreviated monogram letters on the company details screen
     */
    .filter('monogramLetters', function () {
        return function (input) {
            if (input) {
                return input.match(/\b\w/g).join('');
            }
        };
    });
