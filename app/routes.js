let data = require("./data.json");

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
        res.contentType('json');
        res.send({ some: JSON.stringify({ response: 'json' }) });
    });
}
