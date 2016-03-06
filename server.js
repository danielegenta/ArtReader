var dispatcher = require ('./Dispatcher.js');
var crypto = require('crypto');
var http = require('http');
var fs = require('fs');
var sqlite = require('C:/Users/danyg/AppData/Roaming/npm/node_modules/sqlite3');
sqlite.verbose();

//http://lollyrock.com/articles/nodejs-encryption/
var server = http.createServer(function(request, response) {
	if(request.method.toLowerCase() == "post")
		dispatcher.leggiPostParameters(request, response, function(request, response) {
			dispatcher.dispatch(request, response);
		});
	else
		dispatcher.dispatch(request, response);
});


var port = 8080;
server.listen(port);
console.log("Server avviato, in ascolto sulla porta " + port);

//--------------------
dispatcher.addListener ("post", "/access", function(req,res) {
	var utente = req.parametriPost.txtUsername;
	var cryptedPassword = crypto.createHash('sha256').update(req.parametriPost.txtPassword).digest('base64');
	var logged = false;
	
	sqlite.verbose();
	var db = new sqlite.Database("./Database/myDatabase.db");
	var index = -1;
	db.serialize(function(){
		
		if (utente != undefined && cryptedPassword != undefined)
		{
			var sql = "SELECT DISTINCT(Username) FROM Users WHERE Username='" + utente + "' AND Password = '" + cryptedPassword + "'";
			
			db.each(sql, function(err, row)
			{
				index = row.Id;
			},
			function(err, nRecord)
			{
				if (index != -1)
				{
					logged = true;
					var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
					dispatcher.aggiornaPagina("./pages/index.html", function(window){
						res.writeHead(200,header);
						res.end(window.document.documentElement.innerHTML);
					});
				}
				else
				{
					console.log("dati errati");
					var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
					dispatcher.aggiornaPagina("./pages/login.html", function(window){
						res.writeHead(200,header);
						res.end(window.document.documentElement.innerHTML);
					});
				}
			});	
		}
		else
		{
			//highlight dei campi in rosso (ajax?)
			dispatcher.aggiornaPagina("./pages/login.html", function(window){
			res.writeHead(200,header);
			res.end(window.document.documentElement.innerHTML);
			});
		}
	});
	db.close();	
});

dispatcher.addListener ("get", "/welcome", function(req,res) {	
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	dispatcher.aggiornaPagina("./pages/login.html", function(window){
		res.writeHead(200,header);
		res.end(window.document.documentElement.innerHTML);
	});
});


//API CRUD

//add artwork
dispatcher.addListener("get", "/insertArtwork", function(request, response){
	var title = request.parametriGet.title;
	var author = request.parametriGet.author;
	var pictureUrl = request.parametriGet.pictureUrl;
	var pictureAbstract = request.parametriGet.pictureAbstract;
	console.log("inserimento in corso...");
    dispatcher.aggiornaPagina("./pages/index.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("INSERT INTO Artworks (Title,Author,Abstract,PictureUrl) values(?,?,?,?)");
				insert.run(title, author, pictureAbstract, pictureUrl);
				insert.finalize();	
				response.writeHead(200, header);
				response.end("record aggiunto");								
				db.close();	
		}); 
	});
});

//delete artwork
dispatcher.addListener("get", "/delArtwork", function(request, response){
	//var title = req.parametriGet.title;
	console.log("ok server");
    /*dispatcher.aggiornaPagina("./pages/index.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
		var db = new sqlite.Database("Data/dataBase.db");
		console.log("DB: "+db);
		db.serialize(function(){
				var insert=db.prepare("delete FROM artworks where title='x'");
				insert.run();
				insert.finalize();	
				response.writeHead(200, header);
				response.end("record eliminato");								
				db.close();	
		}); 
	});*/
});

//update artwork
dispatcher.addListener("get", "/updArtwork", function(request, response){
    dispatcher.aggiornaPagina("./pages/index.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
		var db = new sqlite.Database("Data/dataBase.db");
		console.log("DB: "+db);
		db.serialize(function(){
				var insert=db.prepare("update artworks set title='y',author='y',abstract='y',pictureUrl='y' where title='x'");
				insert.run();
				insert.finalize();	
				response.writeHead(200, header);
				response.end("record aggiornato");								
				db.close();	
		}); 
	});
});

//only one artwork info
dispatcher.addListener("get", "/oneArtwork", function(request, response){
    dispatcher.aggiornaPagina("./pages/pagina21.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
		var db = new sqlite.Database("Data/dataBase.db");
		console.log("DB: "+db);
		db.serialize(function(){
			var sql = "SELECT * FROM artworks where id="+2;
            var json;

            //
            var artwork = {};
			db.get(sql, 
				function(err, row){		
					if(row!=undefined)
					{
						artwork.id = row.id;
						artwork.title = row.title;
						artwork.author = row.author;
						artwork.abstract = row.abstract;
						artwork.pictureUrl = row.pictureUrl;

						json = JSON.stringify(artwork);
					
						response.writeHead(200, header);
						response.end(json);	
					}							
				});
				db.close();	
		}); 
	});
});

//all artwork info
dispatcher.addListener("get", "/allArtworks", function(request, response){
    dispatcher.aggiornaPagina("./pages/index.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
			var sql = "SELECT * FROM Artworks";
            var json;
	
			var listArtworks = [];
			
			db.each(sql, 
				function(err, row){
					var artwork = {};
		
					artwork.id = row.Id;
					artwork.title = row.Title;
					artwork.author = row.Author;
					artwork.pictureAbstract = row.Abstract;
					artwork.pictureUrl = row.PictureUrl;
					listArtworks.push(artwork);
				},
				function(err, nRighe){
			
							json = JSON.stringify(listArtworks);
							response.writeHead(200, header);
							console.log(json);
							response.end(json);								
				});
				db.close();	
		}); 
	});
});

/*
admin:
daniele.genta daniele
davide.massimino davide

new user:
db.serialize(function(){
						sql = "INSERT INTO Users VALUES (2, '" + utente + "', '" + cryptedPassword + "')";
						db.run(sql, function(err)
						{
							if(err)
								console.log("Error inserting data");
							else	
								console.log("Data inserted correctly");
						});
					});
*/
