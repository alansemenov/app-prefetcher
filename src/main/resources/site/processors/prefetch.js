var portal = require('/lib/xp/portal');

exports.responseProcessor = function (req, res) {

    var body = res.body;
/*

    if (req.url.indexOf(req.headers['Referer']) === -1) {
        return res;
    }
*/

    if (req.mode !== 'live' || !body) {
        return res;
    }

    // TODO: Use HTML Parser!
    // TODO: ES6
    var anchors = body.match(new RegExp('<a\\s[^>]*href\\s*=\\s*\"([^\"#]*)\"[^>]*>(.*?)', 'g'));
    var urls = [];

    //log.info(anchors);
    //log.info(JSON.stringify(req, null, 2));

    if (!anchors) {
        return res;
    }

    var headSnippet = '<!-- Prefetching -->';

    anchors.forEach(function(link) {
        var hits = link.match(new RegExp('href=[\'"]?([^\'" >]+)', 'g'));
        if (hits) {
            var url = hits[0].replace('href=', '').replace('"', '').replace('\'', '');
            //log.info(url);
            if (urls.indexOf(url) == -1 &&
                (url.indexOf('http://') == 0 || url.indexOf('https://') == 0 || url.indexOf('/') == 0)) {
                urls.push(url);
                headSnippet += '<link rel="prefetch" href="' + url + '">';
            }
        }
    });

    var headEnd = res.pageContributions.headEnd;
    if (!headEnd) {
        res.pageContributions.headEnd = [];
    }
    res.pageContributions.headEnd.push(headSnippet);

    return res;
};