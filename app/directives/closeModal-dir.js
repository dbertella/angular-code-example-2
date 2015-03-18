'use strict';

app.directive('closeModal', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function ($scope) {
                var img = angular.element(document.querySelectorAll('.animated')).find('img');
                angular.element(document.querySelector('.modal')).removeClass('show');
                $timeout(function () {
                    img
                        .css('-webkit-transform', 'translate3d(0, 0, 0) scale(1)')
                        .css('transform', 'translate3d(0, 0, 0) scale(1)');
                    $timeout(function () {
                        angular.element(document.querySelectorAll('.animate-content'))
                            .removeClass('hide').removeClass('animated');
                        angular.element(document.querySelector('.modal')).css('display', 'none');
                    }, 200);
                }, 400);
            });
        }
    };
}]);