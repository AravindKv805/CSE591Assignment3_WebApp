let data = require("./data.json");
let SolrNode = require('solr-node');
let solr_config = require('./solr_config.json');

let client = new SolrNode(solr_config);

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
        const textLimit = 70;
        let queryText = req.query.q.replace(/[^\w\s|\.]/g, " ").replace(/\s+/g, " ");
        let qId = req.query.qId;

        strQuery = client.query().q('content:' + queryText);
        client.search(strQuery, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            }

            let docs = result.response.docs;
            let question = {};

            if (qId != undefined && qId != "" && parseInt(qId) > -1) {
                let i = parseInt(qId);
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
