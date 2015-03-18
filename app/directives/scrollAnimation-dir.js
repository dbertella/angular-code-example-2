'use strict';

app.directive('scrollAnimation', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            window.addEventListener('scroll', function () {
                var offset = window.pageYOffset;
                    
                if (offset > 0) {
                    element.addClass('scrolling');
                } else {
                    element.removeClass('scrolling');
                }
                if (attrs.scrollAnimation) {
                    if (offset > 100) {
                        $timeout(function () {
                            element.addClass('step-2');
                        }, 1000);
                    } else {
                        element.removeClass('step-2');
                    }
                }
            });
        }
    };
});
