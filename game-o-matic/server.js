var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var parser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs');
app.engine('.html',ejs.renderFile);

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){

    //url = 'https://play.google.com/store/apps/details?id=com.nway.powerrangerslegacywars';
	res.render('index.html');
});


app.post('/', function (req, res) {


	var url = req.body.url_lbc;
	
    request(url, function(error, response, html){
        if (!error) {
            var $ = cheerio.load(html);

            var title, genre, description, score;
            var json = {id: "", title : "", genre : "", description : "", score : ""};

            title = $('.id-app-title').text();

            genre = $('.document-subtitle.category').children().text();

            description = $('.show-more-content.text-body').children().first().text();

            score = $('.score').text();
			
			var expr = "[\?&]id=([^&]+)";
			var re = new RegExp(expr, 'gm');
			var resexp = re.exec(url);
			
			var resexp2 = resexp[1];

			
			if (resexp2 != null) {
				json.id = resexp2;
				json.title = title;
				json.genre = genre;
				json.description = description;
				json.score = score;
			
				fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
					console.log('Change this function to add games to the existing JSON file');
				})

				MongoClient.connect("mongodb://localhost/nomadikgames", function(error, db) {
					if (error) return funcCallback(error);

					console.log("Connecté à la base de données 'nomadikgames'");
					
					/*var queryOk = false;
					var bExist = false;
					db.collection('games').find({'id': resexp2}, function(error, results) {
						console.log('find callback, results = ');
						console.log(results);
						bExist = results.count() > 0;
						queryOk = true;
					});				
					
					while (!queryOk) console.log("attente");
					if (!bExist){
					*/
						db.collection('games').insert(json, null, function (error, results) {
							if (error) throw error;

							console.log("Le document a bien été inséré");    
						});
					/*}
					else {
						console.log("jeu déjà en base");
					}
					*/
					var resultat = "<p class='title'>Title: <a target='_blank'>" + title + "</a></p>";
						resultat += "<p class='genre'>Genre: <a target='_blank'>" + genre + "</a></p>";
						resultat += "<p class='description'>Description: <a target='_blank'>" + description + "</a></p>";
						resultat += "<p class='score'>Score: <a target='_blank'>" + score + "</a></p>";
				   
				   
						res.render('index.html', { msg: resultat });
						
				});
			} // if resexp2
		} //if !error
	});
}); 


app.listen('3000')
console.log('Magic happens on port 3000');
exports = module.exports = app;