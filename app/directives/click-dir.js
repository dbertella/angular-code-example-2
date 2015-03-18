'use strict';

app.directive('clickAnimation', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function () {
                element.addClass('clicked');
                $timeout(function () {
                    element.removeClass('clicked');
                }, 300);
            });
        }
    };
}]);