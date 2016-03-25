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
dispatcher.addListener ("post", "/access", function(request,response) {
	var utente = request.parametriPost.txtUsername;
	var cryptedPassword = crypto.createHash('sha256').update(request.parametriPost.txtPassword).digest('base64');
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
						response.writeHead(200,header);
						response.end(window.document.documentElement.innerHTML);
					});
				}
				else
				{
					console.log("dati errati");
					var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
					dispatcher.aggiornaPagina("./pages/login.html", function(window){
						response.writeHead(200,header);
						response.end(window.document.documentElement.innerHTML);
					});
				}
			});	
		}
		else
		{
			//highlight dei campi in rosso (ajax?)
			dispatcher.aggiornaPagina("./pages/login.html", function(window){
			response.writeHead(200,header);
			response.end(window.document.documentElement.innerHTML);
			});
		}
	});
	db.close();	
});

dispatcher.addListener ("post", "/artworkDetails", function(request,response)
 {
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	dispatcher.aggiornaPagina("./pages/singleArtwork.html", function(window){
		response.writeHead(200,header);
		response.end(window.document.documentElement.innerHTML);
	});
});

dispatcher.addListener ("get", "/welcome", function(request,response) {	
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	dispatcher.aggiornaPagina("./pages/login.html", function(window){
		response.writeHead(200,header);
		response.end(window.document.documentElement.innerHTML);
	});
});


/**********************
*API CRUD
***********************/

//add artwork
dispatcher.addListener("get", "/insertArtwork", function(request, response){
	var title = request.parametriGet.title;
	var author = request.parametriGet.author;
	var pictureUrl = request.parametriGet.pictureUrl;
	var pictureAbstract = request.parametriGet.pictureAbstract;
	console.log("inserimento in corso...");
	var header = {'Content-Type' : 'text/plain', 'Cache-Control':'no-cache, must-revalidate'};
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("INSERT INTO Artworks (Title,Author,Abstract,PictureUrl) values(?,?,?,?)");
				insert.run(title, author, pictureAbstract, pictureUrl);
				insert.finalize();	
				response.writeHead(200,header);
				response.end("ok");								
				db.close();	
	});
});

//delete artwork
dispatcher.addListener("get", "/delArtwork", function(request, response){
	var id = request.parametriGet.id;
	var header = {"Content-Type":"text/html"};	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("delete FROM Artworks where Id="+id);
				insert.run();
				insert.finalize();	
				response.writeHead(200, header);
				response.end("record eliminato");								
				db.close();	
	});
});

//update artwork
dispatcher.addListener("get", "/updArtwork", function(request, response){
	var title = request.parametriGet.title;
	var author = request.parametriGet.author;
	var abstract = request.parametriGet.pictureAbstract;
	var pictureurl = request.parametriGet.pictureUrl;
	var header = {"Content-Type":"text/html"};	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("update artworks set author='"+author+"',abstract='"+abstract+"',pictureUrl='"+pictureurl+"' where title='"+title+"'");
				insert.run();
				insert.finalize();	
				response.writeHead(200, header);
				response.end("record aggiornato");								
				db.close();	
	});
});

//one artwork info
dispatcher.addListener("get", "/oneArtwork", function(request, response){
	var id = request.parametriGet.id;
	var header = {"Content-Type":"text/html"};	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
			var insert=db.prepare("UPDATE Artworks SET NViews = NViews + 1 WHERE Id="+id);
			insert.run();
			insert.finalize();
			db.serialize(function(){
			var sql = "SELECT * FROM Artworks, LocationsArtworks, Authors WHERE id="+id+" AND Artworks.Location = LocationsArtworks.IdLocationsArtworks AND Artworks.Author = Authors.IdAuthors";
            
			var json;
            var json;
            var artwork = {};
			db.get(sql, function(err, row)
			{
				if(row!=undefined)
				{
					artwork.id = row.Id;
					artwork.title = row.Title;
					artwork.author = row.Author;
					artwork.abstract = row.Abstract;
					artwork.pictureUrl = row.PictureUrl;
					artwork.tecnique = row.Tecnique;
					artwork.year = row.Year;
					artwork.artMovement = row.ArtMovement;
					artwork.dimensionHeight = row.DimensionHeight;
					artwork.dimensionWidth = row.DimensionWidth;
					artwork.wikipediaPageArtwork = row.WikipediaPageArtwork;
					artwork.location = row.Location
					artwork.pictureUrl2 = row.PictureUrl2;
					artwork.pictureUrl3 = row.PictureUrl3;
					
					//field table 'locationsArtworks'
					artwork.idLocationsArtworks = row.IdLocationsArtworks;
					artwork.description = row.Description;
					artwork.city = row.City;
					artwork.nation = row.Nation;
					artwork.wikipediaPageLocation = row.WikipediaPageLocation;
					
					//field table 'authors'
					artwork.idAuthor = row.IdAuthors;
					artwork.name = row.Name;
					artwork.wikipediaPageAuthor = row.WikipediaPageAuthor;
					artwork.nationalityAuthor = row.NationalityAuthor;

					
					
					json = JSON.stringify(artwork);
					
					response.writeHead(200, header);
					response.end(json);	
					
					
					
				}							
				}),
				/*function(err, row)
				{
					
					//db = new sqlite.Database("Database/myDatabase.db");
					//console.log("....."+myId);
					
				}
				);*/
				
		
				
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
			var sql = "SELECT * FROM Artworks, Authors, LocationsArtworks WHERE Authors.IdAuthors = Artworks.Author AND Artworks.Location = LocationsArtworks.IdLocationsArtworks ORDER BY nViews DESC";
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
					artwork.nViews = row.NViews;
					//
					artwork.name = row.Name;
					artwork.description = row.Description;
					listArtworks.push(artwork);
				},
				function(err, nRighe){
					json = JSON.stringify(listArtworks);
					response.writeHead(200, header);
					response.end(json);				
				});
				db.close();	
		}); 
	});
});

/***********
* Other API
************/

//search artwork 
dispatcher.addListener("get", "/searchArtwork", function(request, response){
    dispatcher.aggiornaPagina("./pages/index.html", function(window){
		
	var partialTitle = request.parametriGet.title;
	
	
	var partialAuthor = request.parametriGet.author;
	
	
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
		if (partialTitle != "" && partialAuthor != "")
			var sql = "SELECT * FROM Artworks, Authors WHERE Authors.IdAuthors = Artworks.Author AND (Title LIKE '" + partialTitle + "%' OR Authors.Name LIKE '" + partialAuthor + "%') ORDER BY NViews DESC";
		else
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
				artwork.nViews = row.NViews;
				listArtworks.push(artwork);
			},
			function(err, nRighe){
				json = JSON.stringify(listArtworks);
				response.writeHead(200, header);
				response.end(json);								
			});
			db.close();	
	}); 
	});
});

//similar artwork 
dispatcher.addListener("get", "/similarArtworks", function(request, response){
    //dispatcher.aggiornaPagina("./pages/index.html", function(window){
		
	var author = request.parametriGet.author;
	var title = request.parametriGet.title;
	var artMovement = request.parametriGet.artMovement;
	
	var header = {"Content-Type":"text/html"};	
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
	var sql = "SELECT * FROM Artworks,Authors WHERE Artworks.Author = Authors.idAuthors AND (Authors.Name = '" + author + "' OR ArtMovement='"+ artMovement +"') And (Title != '" + title +"') ORDER BY NViews DESC LIMIT 3 ";
		var json;
		var listArtworks = [];
		db.each(sql, 
			function(err, row){
				var artwork = {};
				artwork.id = row.Id;
				artwork.title = row.Title;
				artwork.pictureUrl = row.PictureUrl;
				artwork.nViews = row.NViews;
				artwork.dimensionHeight = row.DimensionHeight;
				artwork.dimensionWidth = row.DimensionWidth;
				listArtworks.push(artwork);
				
			},
			function(err, nRighe){
				json = JSON.stringify(listArtworks);
				
				response.writeHead(200, header);
				response.end(json);								
			});
			db.close();	
	}); 
	//});
});


/////////////////////////////////////////SUGGERIMENTI SIMIL GOOGOLE
dispatcher.addListener("get", "/completion", function(req, res) {	

    var testo = req.parametriGet.parolaCercata;
    var vectTrovate = [];
    if(testo != "")
    {
        var parole = testo;
        var db = new sqlite.Database("Database/myDatabase.db");
            
        db.serialize(function()
        {
            var sql = "SELECT * FROM Artworks, Authors WHERE Artworks.Author = Authors.idAuthors AND (Title LIKE '" + parole + "%' OR Authors.Name LIKE '" + parole + "%')";
            sql += " order by NViews desc limit 4";
            
            db.each(sql,function(err,row)
            {
                var parola = {};
				parola.voce = row.Title + " - " + row.Name + " - " + row.ArtMovement + " - "+row.Year;
                vectTrovate.push(parola);
            },function(err,nRighe)
            {
                res.writeHead(200,{'Content-type':'text/plain'});
                res.end(JSON.stringify(vectTrovate));
            });
        });
    }
    else
    {
        res.writeHead(200,{'Content-type':'text/plain'});
        res.end(JSON.stringify(vectTrovate));
    }
}); 


/*
admin:
daniele.genta 
pw: daniele
davide.massimino 
pw: davide

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
