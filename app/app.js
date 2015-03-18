'use strict';

var app = angular.module('fwApp', ['ui.router', 'angular-data.DSCacheFactory', 'ngTouch']);

//default culture
app.value('defaultCulture', 'it');
//base api url
app.value('baseHttpUrl', '/api');
//api cache duration in seconds - 12 hours
app.value('cacheDuration', 12 * 3600); 

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/it");

    $stateProvider
      .state('home', {
          url: "/:lang",
          templateUrl: "/www/app/templates/home.html",
          controller: 'mainCtrl'
      })
      .state('home.video', {
          url: "/:videoId",
          templateUrl: "/www/app/templates/modal.html",
          controller: 'modalCtrl'
      });
}]);
