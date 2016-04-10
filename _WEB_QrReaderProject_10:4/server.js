var express = require("C:/Users/danyg/AppData/Roaming/npm/node_modules/express")
, router = express.Router()
, multer = require("C:/Users/danyg/AppData/Roaming/npm/node_modules/multer")
var uploading = multer({
  dest: __dirname + './img',
});

var session = require("C:/Users/danyg/AppData/Roaming/npm/node_modules/express-session");
var bodyParser = require("C:/Users/danyg/AppData/Roaming/npm/node_modules/body-parser");
var utility=require("./Utility.js");
var crypto = require('crypto');
var sqlite = require('C:/Users/danyg/AppData/Roaming/npm/node_modules/sqlite3');
var port = 8080;
var app = express();

app.use(express.static("public"));

app.listen(port, function () {
    //var port = this.address().port recupera la porta del server
    console.log("server avviato sulla porta : " + port);

});


//midleware per il parsing dei parametri post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//midleware per il log delle richieste
app.use(function (request, response, next) {
    var d = new Date();
    //visualizza la data, il metodo e la risorsa richiesta
    console.log(d.toLocaleTimeString() + " >>> " + request.method + " : " + request.originalUrl);
    for (key in request.query)
        console.log("\t" + key + " : " + request.query[key]);

    for (key in request.params)
        console.log("\t" + key + " : " + request.params[key]);

    for (key in request.body)
        console.log("\t" + key + " : " + request.body[key]);
    next();
});


//midleware per l'inclusione delle variabili session
app.use(session({
	// chiave di hash per la cifratura irreversibile di sessionID 
    // (autenticazione HMAC)	
    secret: "myKeyword",
    // nome da assegnare al cookie in cui salvare il sessionID
    name: "sessionId",   // The default value is 'connect.sid'.
	// proprietà legate allo Store delle Session su db
    resave: false,
    saveUninitialized: false,
    cookie: { 
	    // true per accessi https
        secure: false,
		// durata in msec
        maxAge: 60000
    }
	/*
	store: mongoStore({
		url: app.set('db-uri')
	}),
	*/
}));

//-------- INIZIO AREA CLIENT ---------
app.post("/access", function (request, response, next) {
    var utente = request.body["txtUsername"];

	var cryptedPassword = crypto.createHash('sha256').update( request.body["txtPassword"]).digest('base64');
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
					utility.aggiornaPagina("./pages/index.html", function(window){
						response.writeHead(200,header);
						
						response.end(window.document.documentElement.innerHTML);
					});
					
				}
				else
				{
					console.log("dati errati");
					var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
					utility.aggiornaPagina("./pages/login.html", function(window){
						response.writeHead(200,header);
						response.end(window.document.documentElement.innerHTML);
					});
				}
			});	
		}
		else
		{
			//highlight dei campi in rosso (ajax?)
			utility.aggiornaPagina("./pages/login.html", function(window){
			response.writeHead(200,header);
			response.end(window.document.documentElement.innerHTML);
			});
		}
	});
	db.close();	
});

app.post("/artworkDetails",function(request,response,next)
{
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	utility.aggiornaPagina("./pages/singleArtwork.html", function(window){
		response.writeHead(200,header);
		response.end(window.document.documentElement.innerHTML);
	});
});

app.get( "/welcome", function(request,response,next) {	
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	utility.aggiornaPagina("./pages/login.html", function(window){
		response.writeHead(200,header);
		response.end(window.document.documentElement.innerHTML);
	});
});

/**********************
*API CRUD
***********************/
//upload
/*router.post('/upload', uploading, function(req, res) {

})*/

//add artwork
app.get( "/insertArtwork", function(request, response,next){
	var title = request.query["title"];
	var author = request.query["author"];
	
	title = title.replace("'","''");
	author=author.replace("'","''");
	
	var pictureUrl = request.query["pictureUrl"];
	var pictureAbstract = request.query["pictureAbstract"];
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
app.get("/delArtwork", function(request, response,next){
	var id = request.query["id"];
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
app.get( "/updArtwork", function(request, response,next){
	var title = request.query["title"];
	var author = request.query["author"];
	
	title = title.replace("'","''");
	author =author.replace("'","''");
	
	var abstract = request.query["pictureAbstract"];
	var pictureurl = request.query["pictureUrl"];
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
app.get("/oneArtwork", function(request, response,next){
	var id = request.query["id"];
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
					artwork.address = row.Address;
					
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
app.get("/allArtworks", function(request, response,next){
    utility.aggiornaPagina("./pages/index.html", function(window){
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
app.get("/searchArtwork", function(request, response,next){
    utility.aggiornaPagina("./pages/index.html", function(window){
	var partialTitle = request.query["title"];
	var partialAuthor = request.query["author"];
	
	partialTitle = partialTitle.replace("'","''");
	partialAuthor = partialAuthor.replace("'","''");
	
	
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
		if (partialTitle != "" && partialAuthor != "")
			var sql = "SELECT * FROM Artworks, Authors, LocationsArtworks WHERE Artworks.Location = LocationsArtworks.IdLocationsArtworks AND Authors.IdAuthors = Artworks.Author AND (Title LIKE '" + partialTitle + "%' OR Authors.Name LIKE '" + partialAuthor + "%') ORDER BY NViews DESC";
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
				artwork.name = row.Name;
				artwork.description = row.Description;
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
app.get("/similarArtworks", function(request, response,next){
    //utility.aggiornaPagina("./pages/index.html", function(window){
		
	var author = request.query["author"];
	var title = request.query["title"];
	
	title = title.replace("'","''");
	author =author.replace("'","''");
	
	var artMovement = request.query["artMovement"];
	
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
app.get("/completion", function(req, res,next) {	

    var testo = req.query["parolaCercata"];
	testo = testo.replace("'","''");
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
