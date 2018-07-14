$(function () {
    var token = getToken();
    if (token != '') {
        var spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(token);
        searchSpotify();
    }

    $('#login').on('click', loginHandler);
    $('#searchResults').on('click', searchResultsHandler);
    $('#searchButton').on('click', searchSpotify);

    function loginHandler(e) {
        // https://developer.spotify.com/documentation/general/guides/authorization-guide/
        // Implicit Grant Flow
        var client_id = 'ba1624af2e3d4416aa1d79e647c24f6b';
        var response_type = 'token';
        var redirect_uri = location.href;

        //redirect to authorization
        location.href = 'https://accounts.spotify.com/authorize'
            + '?client_id=' + client_id
            + '&response_type=' + response_type
            + '&redirect_uri=' + redirect_uri;
    }

    function getToken() {
        debugger;
        var result = '';
        // Get the hash of the url
        if (window.location.hash != '') {
            var hash = window.location.hash
                .substring(1)
                .split('&')
                .reduce(function (initial, item) {
                    if (item) {
                        var parts = item.split('=');
                        initial[parts[0]] = decodeURIComponent(parts[1]);
                    }
                    return initial;
                }, {});
            result = hash.access_token;
            window.location.hash = '';
        }
        return result;
    }

    function searchSpotify() {
        if (token != '') {
            var searchQuery = $('#query').val();
            var type = ['playlist'];
            spotifyApi.search(searchQuery, type).then(function (data) {
                console.log('Artist information', data);
                var firstPlaylist = data.playlists.items[0];
                updatePlayer(firstPlaylist.uri);
                displayResults(data.playlists.items);
            }, function (err) {
                console.error(err);
            });
        }
        else {
            loginHandler();
        }
    }

    function displayResults(results) {
        var items = '';
        for (var i = 0; i < results.length; i++) {
            items += '<li data-uri="' + results[i].uri + '">'
                + '<img src="' + results[i].images[0].url + '">'
                + '<a href="javascript:;">' + results[i].name + '</a>'
                + '</li>'
        }
        $('#searchResults').html(items);
    }

    function searchResultsHandler(e) {
        var uri = $(e.target).closest('li').data('uri');
        updatePlayer(uri);
        $(window).scrollTop(0);
    }

    function updatePlayer(uri) {
        $('iframe').attr('src', 'https://open.spotify.com/embed?uri=' + uri);
    }
});
