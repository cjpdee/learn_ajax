/**
 * This script will do 2 things:
 * 1. Collect all the users who posted to a given
 *    subreddit
 * 2. Get data for each of those users' comments,
 *    and which subreddit they are posted in
 * 
 * Then use array methods to analyse the data
 */

/**
 * 
 */

var endpoint;

var limitToSub = false;
var range, subreddit, dateRange, sortBy, postType;

var subredditData = [];
var subredditPostsOfType = [];
var commentData = [];

const defaults = {
    range: 1,
    subreddit: "all",
    filterBy: "top",
    dateRange: "year",
    limitToSub: false
}

$("[data-js-search='submit']").on('click', function(e) {
    e.preventDefault();

    range = $("[data-js-search='number-of-results']").val();

    subreddit = $("[data-js-search='subreddit']").val();
    sortBy = $("[data-js-search='sort-by']").val();
    dateRange = $("[data-js-search='date-range']").val();
    postType = $("[data-js-search='post-type']").val();

    if($("[data-js-search='limit-to-sub']").is(":checked")) {limitToSub = true;}

    console.log(range,subreddit,postType,dateRange,sortBy);
    start();
});




var start = function() {
    
    if(!subreddit){ subreddit = defaults.subreddit }
    if(!range)    { range = defaults.range }

    endpoint = "https://www.reddit.com/r/" + subreddit + '/' + sortBy + '/' + ".json?limit=" + range + "&after=t3_10omtd/" + "&t=" + dateRange;
    
    
    
    
    // Oauth and headers
    const bearer_token = '-38qL93KEKgLoavUT7fUgoVLqN50';
    
    // get the initial subreddit data
    fetch(endpoint).then(
        function(response) {
            if(response.status !== 200) {
                console.log("There was an error, error code: " + response.status);
                return;
            }
            response.json().then(function(data) {
                // pass each post to getUsers
                getUsers(data.data.children);
            }).then(function() {
                console.log(commentData);
                
                //console.log(JSON.stringify(commentData));
                
            });
        }
    );
    
    
    
    
}


// logic to get each user
function getUsers(data) {
    data.forEach(function(post, i) {
        switch (postType) {
            case 'self':
                if (post.data.is_self == true) {
                    subredditPostsOfType.push(post);
                }
                break;
            case 'all':
            default:
                subredditPostsOfType.push(post);
                break;
            case 'img':
                if (post.data.url.endsWith('.jpg') || post.data.url.endsWith('.png') || post.data.url.endsWith('.jpeg')) {
                    subredditPostsOfType.push(post);
                }
        }
    
    });
    getComments(subredditPostsOfType);
}


function getComments(data) {
    console.log(data)
    data.forEach(function(item, i) {

        let userEndpoint = "https://www.reddit.com/user/" + item.data.author + '/comments.json';
        
        if (item.data.author == "[deleted]") {
            return;
        }

        fetch(userEndpoint)
            .then(
                function(response) {
                    if(response.status !== 200) {
                        console.log("Error getting user data, error code " + response.status);
                        return;
                    }
                    response.json().then(function(data) {

                        createCommentsArray(data,function() {
                            commentData.forEach(function(item,i) {
                                render(item,i);
                            })
                            //console.log(commentData[9]);
                        });
                    })
                }
            )
        });
}


function render(item,i) {
    // create a box to output stuff in
    $("<div/>", {
        class: "output",
        i: i
    }).appendTo(".output-wrap");

    $("<div/>", {
        class: "header",
    }).appendTo(".output[i='"+i+"']");

    // create username field
    $("<span/>", {
        class:"username",
    }).text(item.user).appendTo(".output[i='"+i+"'] .header");

    $("<span/>", {
        class: "score"
    }).text(item.score).appendTo(".output[i='"+i+"'] .header");

    $("<span/>", {
        class: "subreddit"
    }).text(item.subreddit).appendTo(".output[i='"+i+"'] .header");

    $("<p/>", {
        class: "comment"
    }).text(item.comment).appendTo(".output[i='"+i+"']");
}

function createCommentsArray(data, callback) {
    //console.log(data.data.children); // get comment values
    data.data.children.forEach(function(item, i) {
        if(limitToSub == true) {
            if(item.data.subreddit == subreddit) {
                commentData.push(
                    {
                        "user": item.data.author,
                        "subreddit": item.data.subreddit,
                        "score": item.data.score,
                        "comment":item.data.body,
                    }
                );
            } else {
            }
        } else {
            commentData.push(
                {
                    "user": item.data.author,
                    "subreddit": item.data.subreddit,
                    "score": item.data.score,
                    "comment":item.data.body,
                }
            );
        }
    });
    callback();
}