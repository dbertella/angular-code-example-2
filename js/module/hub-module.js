var hubModule = (function () {

    function stateConversion(state) {
        if (state == $.signalR.connectionState.connecting)
            return "connecting";
        if (state == $.signalR.connectionState.connected)
            return "connected";
        if (state == $.signalR.connectionState.reconnecting)
            return "reconnecting";
        if (state == $.signalR.connectionState.disconnected)
            return "disconnected";
    }

    function connectionStateChanged(state) {
        console.log('connection state changed from: ' + stateConversion(state.oldState) + ' to: ' + stateConversion(state.newState));
    }

    var videoHub = $.connection.videoHub;
    var _startVideoCallBack = null;
    var _videoFinishedCallBack = null;

    function setStartVideoCallBack(callback) {
        _startVideoCallBack = callback;
    }

    function startVideoHandler(videoId, videoSrc, posterSrc, lang, trackId) {
        if (_startVideoCallBack) {
            //console.log('startVideoHandler', videoId, videoSrc, posterSrc, lang, trackId);
            _startVideoCallBack(videoId, videoSrc, posterSrc, lang, trackId);
        }
    }

    function setVideoFinishedCallBack(callback) {
        _videoFinishedCallBack = callback;
    }

    function videoFinishedHandler(videoId, completed, timeElapsed, trackId) {
        if (_videoFinishedCallBack) {
            //console.log('videoFinishedHandler', videoId, completed, timeElapsed, trackId);
            _videoFinishedCallBack(videoId, completed, timeElapsed, trackId);
        }
    }

    function init(connectionStartedCallBack) {
        //register client methods
        videoHub.client.playVideo = startVideoHandler;
        videoHub.client.videoFinished = videoFinishedHandler;
        //register connection state handler
        $.connection.hub.stateChanged(connectionStateChanged);
        //start connection
        $.connection.hub.start().done(connectionStartedCallBack);
        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                console.log('hub ' + stateConversion($.connection.hub.state) + ' -> retry to connect');
                $.connection.hub.start();
            }, 15000); // Restart connection after 15 seconds.
        });

    }

    return {
        init: init,
        setStartVideoCallBack: setStartVideoCallBack,
        setVideoFinishedCallBack: setVideoFinishedCallBack,
        stopVideo: videoHub.server.stopVideo
    };

})();