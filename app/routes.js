let data = require("./data.json");
let SolrNode = require('solr-node');

let client = new SolrNode({
    host: 'ec2-34-213-252-195.us-west-2.compute.amazonaws.com',
    port: '8983',
    core: 'mycore',
    protocol: 'http',
    debugLevel: 'ERROR'
});

module.exports = function(app) {

    app.get('/', function(req, res) {

        let posts = [];
        let post = {};
        const textLimit = 70;
        for (var i = 0; i < data.length; i++) {
            post = data[i];
            if (data[i].text.length > textLimit - 3) {
                post.textTrimmed = data[i].text.substring(0, textLimit - 3) + "...";
            } else {
                post.textTrimmed = data[i].text;
            }
            posts.push(post);
        }

        res.render('index.ejs', {
            posts: posts
        });
    });

    app.get('/search', function(req, res) {
        console.log(req.query.q);
        const textLimit = 70;
        let queryText = req.query.q.replace(/[^\w\s|\.]/g, " ").replace(/\s+/g, " ");

        strQuery = client.query().q('content:' + queryText);
        client.search(strQuery, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            }

            let docs = result.response.docs;
            console.log(result.response.docs.length);
            let question = {};

            if (req.query.qId != undefined && req.query.qId != "") {
                let i = parseInt(req.query.qId);
                if (data[i] != undefined && data[i] != null) {
                    question = data[i];
                    if (question.text.length > textLimit - 3) {
                        question.textTrimmed = question.text.substring(0, textLimit - 3) + "...";
                    } else {
                        question.textTrimmed = question.text;
                    }
                }
            }

            res.contentType('json');
            res.send({
                docs: JSON.stringify(docs),
                question: JSON.stringify(question),
                searchText: queryText
            });
        });
    });
}
