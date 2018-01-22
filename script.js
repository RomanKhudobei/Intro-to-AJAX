
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $('#bgimg').remove();    // better use removeChild instead (because of poor support DOM 4)

    // load streetview

    var googleApiKey = '***********************';

    var street = $('#street').val();
    var city = $('#city').val();
    var location = street + ', ' + city;

    $greeting.text('So, you want to live at ' + location + '?');

    var streetViewRequestURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location + '&key=' + googleApiKey;

    $body.append('<img class="bgimg" id="bgimg" src="' + streetViewRequestURL + '">');

    // load New York Times articles

    var NYtimesApiKey = '**********************';

    var NYTimesRequestURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

    NYTimesRequestURL += '?' + $.param({
        'api-key': NYtimesApiKey,
        'q': city
    });

    $.getJSON(NYTimesRequestURL, function (data) {

        if (data.status === 'OK') {

            data = data.response.docs;
            if (data.length !== 0) {

                $nytHeaderElem.append(' about ' + city);

                for (var i in data) {

                    liTag = document.createElement('li');
                    liTag.setAttribute('class', 'article');

                    aTag = document.createElement('a');
                    aTag.setAttribute('href', data[i].web_url);
                    aTagText = document.createTextNode(data[i].headline.main);
                    aTag.appendChild(aTagText);

                    pTag = document.createElement('p');
                    pTagText = document.createTextNode(data[i].snippet);
                    pTag.appendChild(pTagText);

                    liTag.appendChild(aTag);
                    liTag.appendChild(pTag);

                    $nytElem.append(liTag);
                };

            } else {
                $nytHeaderElem.text('New York Times Articles');
                $nytElem.append('Oops... Could not find articles');
            };
        };

        // load wikipedia articles

        wikiRequestURL = 'https://en.wikipedia.org/w/api.php';
        
        var wikiRequestTimeout = setTimeout(function() {
            $wikiElem.text('Failed to get wikipedia resources');
        }, 8000);

        $.ajax({
            url: wikiRequestURL,
            data: {action: 'query', list: 'search', srsearch: city, format: 'json'},
            dataType: 'jsonp',
            success: function (data) {
                data = data.query.search;

                for (var i in data) {
                    liTag = document.createElement('li');

                    aTag = document.createElement('a');
                    aTag.setAttribute('href', 'https://en.wikipedia.org/?curid=' + data[i].pageid);
                    aTag.setAttribute('target', '_blank')

                    aTagText = document.createTextNode(data[i].title);
                    aTag.appendChild(aTagText);

                    liTag.appendChild(aTag);

                    $wikiElem.append(liTag);
                };

                clearTimeout(wikiRequestTimeout);
            }
        });

    }).fail(function() {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    return false;
};

$('#form-container').submit(loadData);
