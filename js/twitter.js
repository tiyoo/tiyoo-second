/*
 * tweetable 1.7.0 - jQuery twitter feed plugin
 *
 * Copyright (c) 2009 Philip Beel (http://www.theodin.co.uk/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * With modifications from Philipp Robbel (http://www.robbel.com/) and Patrick DW (stackoverflow)
 * for IE compatibility.
 *
 * Revision: $Id: jquery.tweetable.js 2012-07-08 $ 
 *
 */
(function($) {

	jQuery.fn.tweetable = function (opts) {
		opts = $.extend({}, $.fn.tweetable.options, opts);

		// Loop through each instance
		return this.each(function () {

			var act = jQuery(this)
			,   tweetList = jQuery('<ul class="tweetList">')[opts.position.toLowerCase() + 'To'](act)
			,   shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
			,   api = "https://api.twitter.com/1/statuses/user_timeline.json?include_entities=false&suppress_response_codes=true&screen_name="
			,   count = "&count="
			,   replies = "&exclude_replies="
			,   rts = "&include_rts="
			,   twitterError
			,   tweetMonth
			,   tweetMonthInt
			,   iterate
			,   element;

			// Fire JSON request to twitter API
			jQuery.getJSON(api + opts.username + count + (opts.limit + 5) + replies + opts.replies + rts + opts.retweets + "&callback=?", act, function (data) {

				// Check for response error 
				twitterError = data && data.error || null;

				if(twitterError)
				{
					tweetList.append('<li class="tweet_content"><p class="tweet_link">'+ opts.failed +'</p></li>');
					return;
				}

				// Loop through twitter API response
				jQuery.each(data, function (i, tweet) {

					// Output tweets if less than limit
					if(i >= opts.limit)
						return;

					tweetList.append('<li class="tweet_content_' + i + '"><p class="tweet_link_' + i + '">' + tweet.text.replace(/#(.*?)(\s|$)/g, '<span class="hash">#$1 </span>').replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$&">$&</a> ').replace(/@(.*?)(\s|\(|\)|$)/g, '<a href="http://twitter.com/$1">@$1 </a>$2') + '</p></li>');
					
					// Display the time of tweet if required
					if (opts.time === true) {
						for(iterate=0; iterate<=12; iterate++) {
							if(shortMonths[iterate] === tweet.created_at.substr(4, 3)) {
								tweetMonthInt = iterate + 1;
								tweetMonth = (tweetMonthInt < 10) ? '0' + tweetMonthInt : tweetMonthInt ;
							}
						}
						// Create ISO 8601 formatted date
						var iso8601 = tweet.created_at.substr(26,4) + '-' + tweetMonth + '-' + tweet.created_at.substr(8, 2) + 'T' + tweet.created_at.substr(11,8) + 'Z';  
						jQuery('.tweet_link_' + i).append('<p class="timestamp"><'
							+ ((opts.html5) ? 'time datetime="' + iso8601 + '"' : 'small') 
							+ '> ' + tweet.created_at.substr(8, 2) + '/' + tweetMonth + '/' + tweet.created_at.substr(26,4) + ', ' + tweet.created_at.substr(11,5) + '</' 
							+ ((opts.html5) ? 'time' : 'small') + 
							'></p>');
					}
				});

				// Display one tweet and retweet
				if ( opts.rotate === true ) {

					var listItem = tweetList.find('li')
					,   listLength = listItem.length || null
					,   current = 0
					,   timeout = opts.speed;	

					if(!listLength)
						return

					// Rotate the tweets one at a time
					function rotateTweets() {
					   listItem.eq(current++).fadeOut(400, function(){
							current = (current === listLength) ? 0 : current;
							listItem.eq(current).fadeIn(400);
					   });
					}
					//Hide all but the first tweet
					listItem.slice(1).hide();

					//Rotate tweets at specified interval
					setInterval(rotateTweets, timeout);
				}		
				opts.onComplete(tweetList);
			});
		});
	};

	// Define plugin defaults
	$.fn.tweetable.options = {
		limit: 5,                       // Number of tweets to show
		username: 'TiyooMediaLLC',         // @username tweets to display
		time: false,                    // Display date
		rotate: false,                  // Rotate tweets
		speed: 5000,                    // Speed of rotation
		replies: false,                 // Filter out @replys
		position: 'append',             // Append position
		failed: "No tweets available",  // Twitter stream unavailable text
		html5: false,                   // HTML5 Support
		retweets: false,                // Show retweets
		onComplete: function($ul) {}    // On complete callback
	};

})(jQuery);

// Twitter function
$(function(){
		$('#twitter').tweetable({
		username: 'envato', 
		time: true,
		rotate: true,
		speed: 4000, 
		limit: 3,
		replies: false,
		position: 'append',
		failed: "Sorry, twitter is currently unavailable for this user.",
		html5: true,
		onComplete:function($ul){
			$('time').timeago();
		}
		});
});

