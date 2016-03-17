var Twit = require('twit');

// Require with the public beta key
var giphy = require('giphy-api')();

var fs = require('fs'),
request = require('request');

var T = new Twit({
	consumer_key: ''
	, consumer_secret: ''
	, access_token: ''
	, access_token_secret: ''
});

var USERNAME = '@giffyfun';

var stream = T.stream('user',{track: 'giffyfun'})
  console.log('Listening');
stream.on('tweet', function (data) {
      console.log('Streaming');
      var tweet = data['text'];
      var screenName = '@' + data['user']['screen_name'];
      var tweetQuery = tweet.substring(screenName.length,tweet.length);
      //var countryCode = data['place']['country_code']
      //var username =
      console.log(tweet);
      console.log(screenName);

      if(screenName != USERNAME){

      //console.log(countryCode);
      console.log(data);

      // Search with options using callback
      giphy.search({
        q: tweetQuery,
        limit: 1
      }, function(err, res) {
    // Res contains gif data!

    if(err){
      console.log(err);
    }else{
        var temp = res['data'];
        console.log(res);
        console.log(temp[0]['images']['original']['url']);
        var imageUrl = temp[0]['images']['original']['url'];

        //Tweet back
        var tweet_response = screenName;


        var imageName = new Date().getTime() + '.gif';

        download(imageUrl, imageName, function(){
          console.log('Image downloaded');
          //
          // post a tweet with media
          //
          var b64content = fs.readFileSync(imageName, { encoding: 'base64' })

          // first we must post the media to Twitter
          T.post('media/upload', { media_data: b64content }, function (err, mediadata, response) {

          // now we can reference the media and post a tweet (media will attach to the tweet)
          var mediaIdStr = mediadata.media_id_string
          var params = { status: tweet_response, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, function (err, tweetdata, response) {
            if(!err){
              fs.unlinkSync(imageName);
            }
          })
        })
        });
      }
    });

  }

  });


  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };


/*T.post('statuses/update', { status: "." }, function(err, data, response) {
  if(err) {
    console.log("There was a problem tweeting the message.", err);
  }
});*/
