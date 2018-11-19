var areas = 'https://www.reddit.com/r/aww.json?limit=99&after=t3_10omtd/';
//var areas = 'https://www.reddit.com/r/all.json?restrict_sr=on'
var myData;
//var query = prompt("Enter search");


fetch(areas)
    .then(
        function(response) {
            if(response.status !== 200) {
                console.log("Problem happened, code is " + response.status);
                return;
            }
            response.json().then(function(data) {
                doStuffWithData(data);
            })
        }
    )

var actualData = [];
function doStuffWithData(data) {
    var dataSet = data.data.children;
    
    dataSet.forEach(dataBit => {
        actualData.push(dataBit.data.title);
    });
    
    console.log(dataSet);
    //console.log(actualData);
    
    var regex = new RegExp(query,"gi");
    //var condition = actualData.filter(title => title.match(regex));
    var result = [];

    dataSet.forEach(point => {
        let title = point.data.title;
        // conditional to find images (theres a better way)
        if ((title.match(regex)) && (point.data.url.endsWith('.jpg') || point.data.url.endsWith('.png') || point.data.url.endsWith('.jpeg')) ) {
            result.push(point);
        }
    });

    console.log(result);

    result.forEach(item => {
        let imgUrl = item.data.url;
        var imgWrap = document.createElement("div")
        imgWrap.setAttribute("class","img-wrap");
        var img = document.createElement("img");
        img.setAttribute("src",imgUrl);
        console.log(img);

        document.body.append(imgWrap);
        imgWrap.append(img);
    })
}