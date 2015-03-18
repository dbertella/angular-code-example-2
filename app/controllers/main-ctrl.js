'use strict';

app.controller('mainCtrl', ['$scope', '$q', '$state', '$stateParams', '$timeout', 'defaultCulture', 'catalogApi', mainCtrl]);

function mainCtrl($scope, $q, $state, $stateParams, $timeout, defaultCulture, catalogApi) {

    var culture = $stateParams.lang || defaultCulture;
    $scope.goToCulture = function (culture) {
        $timeout(function () {
            $state.go('home', {
                lang: culture
            });
        }, 400);
    };

    $q.all([
        catalogApi.getCategories(culture),
        catalogApi.getVideos(culture)
    ])
    .then(function (resultSet) {
        $scope.categories = resultSet[0];
        $scope.videos = resultSet[1];
        angular.element(document.querySelector('.modal')).removeClass('show').css('display', 'none');

        //_.forEach($scope.videos, function (video) {
        //    video.playing = false;
        //});
        $scope.goToVideo = function (videoId) {
            angular.element(document.querySelector('.modal')).css('display', 'block');
            $timeout(function () {
                $state.go('home.video', {
                    videoId: videoId
                });
            }, 400);
        }; 
    });
}