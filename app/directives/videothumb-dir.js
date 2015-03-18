'use strict';

app.directive('videoThumb', function ($timeout, $state) {

    return {
        restrict: 'E',
        scope: {
            video: '='
        },
        template: '<img ng-src="/media/image/thumb/256x170/{{ video.ImageUrl }}" alt="{{video.Title}}" />',

        link: function (scope, el, attrs) {

            el.on('click', function () {
                angular.element(document.querySelectorAll('.animate-content')).addClass('hide');
                el[0].parentNode.classList.add('animated');
                var pos = el[0].getBoundingClientRect();
                var translateTop = 140 - pos.top,
                    translateLeft = 256 - pos.left;

                el.find('img')
                    .css('-webkit-transform', 'translate3d(' + translateLeft + 'px, ' + translateTop + 'px, 0) scale(3)')
                    .css('transform', 'translate3d(' + translateLeft + 'px, ' + translateTop + 'px, 0) scale(3)');

            });           
        }
    };
});