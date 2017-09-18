'use strict';

requirejs.config({
    paths: {
        ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
    },
});

require([
    'ramda',
    'jquery'
],
function(_, $) {
    var trace = _.curry((tag, x) => {
        console.log(tag, x);
        return x;
    });

    // app goes here

    var Impure = { // 不纯的函数
        getJSON: _.curry((callback, url) => { // 参数顺序调整
            $.getJSON(url, callback);
        }),

        setHTML: _.curry((sel, html) => {
            $(sel).html(html);
        })
    }

    var url = term => 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + term + '&format=json&jsoncallback=?'; 

    var mediaUrl = _.compose(_.prop('m'), _.prop('media'));

    var img = url => $('<img />', {src: url});

    var mediaToImage = _.compose(img, mediaUrl);

    var images = _.compose(_.map(mediaToImage), _.prop('items'));

    var renderImages = _.compose(Impure.setHTML('body'), images);

    var app = _.compose(Impure.getJSON(renderImages), url);

    app('cats');
})