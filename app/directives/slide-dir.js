'use strict';

app.directive('exSlide', function ($timeout, $state) {

    var touchEngine = function (scope, element, attrs) {        
        scope.coord = {}
        var fn = function (eventName) {

            if (attrs[eventName]) {
                element[0].removeEventListener('touchstart', touchStart, false);
                element[0].removeEventListener('touchmove', touchMove, false);
                element[0].removeEventListener('touchend', touchEnd, false);
                scope.$eval(attrs[eventName]);
                scope.$apply();
                var img = angular.element(document.querySelector('.animated')).find('img');
                if (img) {
                    img.css('-webkit-transform', 'translate3d(0, 0, 0) scale(1)');                            
                    $timeout(function () {
                        angular.element(document.querySelectorAll('.animate-content')).removeClass('animated');                        
                    }, 300);
                }
            }
        };

        var touchStart = function (e) {
            scope.coord.startX = e.changedTouches[0].pageX;            
        };
        var touchMove = function (e) {
            e.preventDefault();          
            var translateLeft = e.targetTouches[0].pageX - scope.coord.startX;
            var opacity = 1 - Math.abs(e.targetTouches[0].pageX - scope.coord.startX) / 256;                      

            element.find('img').css({            
                '-webkit-transition': 'none',
                '-webkit-transform': 'translate3d(' + translateLeft + 'px, 0, 0)',                         
                'opacity': opacity
            });
        };
        var touchEnd = function (e) {

            scope.coord.endX = e.changedTouches[0].pageX;          
            var direction;
            if (scope.coord.endX > scope.coord.startX) {
                direction = 'right';
            } else {
                direction = 'left';
            }

            var translateLeft = scope.coord.endX - scope.coord.startX;
            if (Math.abs(translateLeft) < 150) {
                translateLeft = 0;
                var opacity = 1;
            } else {
                if (direction === 'left') {                  
                    translateLeft = '-1024px';
                    fn('swipeLeft');
                } else {                    
                    translateLeft = '1024px';
                    fn('swipeRight');
                }
                var opacity = 0;
            }            
            
            element.find('img').css({
                '-webkit-transition': 'transform 0.7s linear, opacity 0.3s linear',                
                '-webkit-transform': 'translate3d(' + translateLeft + ', 0, 0)',
                'opacity': opacity
            });

        };
       
        element[0].addEventListener('touchstart', touchStart, false);     
        element[0].addEventListener('touchmove', touchMove, false);
        element[0].addEventListener('touchend', touchEnd, false);
    };

    return {
        restrict: 'A',
        link: touchEngine
    }
});