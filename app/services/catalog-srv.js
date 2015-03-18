'use strict';

app.factory('catalogApi', ['$http', '$q', 'DSCacheFactory', 'baseHttpUrl', 'defaultCulture', 'cacheDuration', catalogApi]);

function catalogApi($http, $q, DSCacheFactory, baseHttpUrl, defaultCulture, cacheDuration) {


    //setup catalogCache
    var cacheMaxAge = cacheDuration * 1000; // millisecond
    var catalogCache = DSCacheFactory('catalogCache', { storageMode: 'localStorage', maxAge: cacheMaxAge, deleteOnExpire: 'passive' });
    
    catalogCache.setOptions({
        onExpire: function (key, value) {
            expireCache(key, value);
        }
    });

    function expireCache(key, value) {
        get(key).then(
                function () {
                    //console.log('cache refreshed');
                },
                function () {
                    //error in get remote data -> then don't refresh
                    console.error('error in get refresh data');
                    catalogCache.put(key, value);
                }
        );
    }

    /* Helpers */
    function get(resource) {
        resource = resource || '';
        var deferred = $q.defer();
        var localdata = catalogCache.get(resource);
        if (localdata) {
            //console.log('[' + resource + '] found in cache');
            deferred.resolve(localdata);
        } else {
            //console.log('[' + resource + '] get remote');
            var url = baseHttpUrl + resource;
            $http.get(url)
                .success(function (data) {
                    catalogCache.put(resource, data);
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
        }

        return deferred.promise;

    };

    function post(resource, data) {

        var deferred = $q.defer();
        var url = baseHttpUrl + resource;
        $http.post(url, data)
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;

    };

    /* public interface */

    function getCultures() {
        //Code, Name, Default
        return get('/cultures');
    }

    function getCategories(culture) {
        culture = culture || defaultCulture;
        return get('/' + culture + '/categories/');
    }

    function getVideos(culture) {
        culture = culture || defaultCulture;
        return get('/' + culture + '/videos');
    }

    function getVideosByCategoryID(categoryID, culture) {
        return getVideos(culture).then(function (videos) {
            var videosFiltered = _.filter(videos, function (video) {
                return video.CategoryID == categoryID;
            });
            return videosFiltered;
        });
    }

    function getVideo(videoId, culture) {
        var deferred = $q.defer();
        getVideos(culture).then(function (videos) {        
            var video = _.find(videos, { 'ID': videoId });                      
            deferred.resolve(video);
        });
        return deferred.promise;
    }

    function startVideo(id, culture) {
        culture = culture || defaultCulture;
        return get('/' + culture + '/start-video/' + id);
    }

    return {
        getCultures: getCultures,
        getCategories: getCategories,
        getVideos: getVideos,
        getVideosByCategoryID: getVideosByCategoryID,
        getVideo: getVideo,
        startVideo: startVideo
    };
}
