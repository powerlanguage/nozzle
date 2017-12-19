// Setup rainbow gradient
// More stops means more gradual
var colors = ['red', 'orange', "rgb(255, 242, 0)", 'green', 'blue', 'indigo', 'violet', 'red']
var steps = 200;
var grad = tinygradient(colors);
var hexColors = grad.rgb(steps).map(color => color.toHexString());

var maxMessageLength = 250;
var url = 'https://www.reddit.com/r/all/comments.json?limit=100';

var comments = [];
var messageCount = 0;


function fetchComments(callback){
  console.log("fetching comments...");
  $.get(url, response => {
    comments = comments.concat(response.data.children);

    comments = comments.filter(comment => {
      return comment.data.body.length < maxMessageLength;
    });

    console.log(`${comments.length} comments in queue`);
    if(callback){
      callback();
    }
  });
}

function nozzle(data) {
  var $app = $('#app');

  setInterval(() => {
      var comment = comments.pop();

      var div = $("<div>").addClass('comment').text(comment.data.body).css('background-color', hexColors[messageCount]);
      $(div).prependTo($app).hide().slideDown();

      messageCount += 1;
      if(messageCount >= steps) {
        messageCount = 0;
      }

      if(comments.length < 10) {
        fetchComments();
      }

  }, 1000);
}

// kick it off
fetchComments(nozzle);
