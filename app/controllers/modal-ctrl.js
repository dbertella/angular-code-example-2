'use strict';

app.controller('modalCtrl', ['$scope', '$q', '$state', '$stateParams', '$timeout', 'defaultCulture', 'catalogApi', modalCtrl]);

function modalCtrl($scope, $q, $state, $stateParams, $timeout, defaultCulture, catalogApi) {    
    var culture = $stateParams.lang || defaultCulture;
    var videoId = parseInt($stateParams.videoId);
    $scope.currentCulture = culture;
    $timeout(function () {
        
        angular.element(document.querySelectorAll('.animate-content')).addClass('hide');
        angular.element(document.getElementById('video-' + videoId)).addClass('animated');
        var el = document.getElementById('video-' + videoId);
        var pos = el.getBoundingClientRect();
        var translateTop = 140 - pos.top,
            translateLeft = 256 - pos.left;
        angular.element(document.getElementById('video-' + videoId))
            .find('img')
            .css('-webkit-transform', 'translate3d(' + translateLeft + 'px, ' + translateTop + 'px, 0) scale(3)')
            .css('transform', 'translate3d(' + translateLeft + 'px, ' + translateTop + 'px, 0) scale(3)');
        angular.element(document.querySelector('.modal')).addClass('show').css('display', 'block');
    });
    

    catalogApi.getVideos(culture).then(function (videos) {      
        $scope.video = _.find(videos, { 'ID': videoId });
        $scope.closeModal = function () {
            $timeout(function () {
                $state.go('home', {
                    lang: culture
                });
            }, 400);
        };

        $scope.startVideo = function (videoId) {
            catalogApi.startVideo(videoId, culture)
        };
        $scope.goToVideo = function (direction) {
            var d = parseInt(direction);
            var newVideoId;
            var index = videos.indexOf($scope.video);
            var newIndex = index + d;

            if (newIndex < 0) {
                newIndex = videos.length - 1;
            } else if (newIndex > videos.length - 1) {
                newIndex = 0;
            }
            var newVideoId = videos[newIndex].ID;

            angular.element(document.querySelectorAll('.animate-in')).addClass('out');
            $timeout(function () {
                $state.go($state.current, {
                    videoId: newVideoId
                });
            }, 400);
            
        };
    });
    
}