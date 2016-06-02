var express = require("/usr/local/lib/node_modules//express")
var session = require("/usr/local/lib/node_modules/express-session");
var bodyParser = require("/usr/local/lib/node_modules//body-parser");
var sqlite = require('/usr/local/lib/node_modules/sqlite3');
var multer  =   require("/usr/local/lib/node_modules/multer");
var utility=require("./Utility.js");
var crypto = require('crypto');
var nodemailer = require('/usr/local/lib/node_modules/nodemailer');

var multipart = require('/usr/local/lib/node_modules/connect-multiparty');
var multipartMiddleware = multipart();

var fs=require('fs');
var port = 8080;
var app = express();
var transporter;

/*
var express = require("C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/express")
var session = require("C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/express-session");
var bodyParser = require("C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/body-parser");
var sqlite = require('C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/sqlite3');
var multer  =   require("C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/multer");
var utility=require("./Utility.js");
var crypto = require('crypto');
//var cookieParser = require('cookie-parser');

var multipart = require('C:/Users/Hp Notebook/AppData/Roaming/npm/node_modules/connect-multiparty');
var multipartMiddleware = multipart();

var fs=require('fs');
var port = 8080;
var app = express();*/


//file uploading
/*var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img/immagini');
  },
  filename: function (req, file, callback) {
	  console.log("---"+file.originalname);
    callback(null,file.originalname);
  }
});*/
//var upload = multer({ storage : storage}).single('userPhoto');
/*var iframeFileUpload = require('iframe-file-upload-middleware');
iframeFileUpload.addRedirectResponder(app);
app.post(/^.*\/upload$/, iframeFileUpload.middleware());*/

app.use(express.static("public"));
app.use(bodyParser()); 
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
    for (key in request.query)//get
        console.log("\t" + key + " : " + request.query[key]);

    for (key in request.params)//get passati come parametro
        console.log("\t" + key + " : " + request.params[key]);

    for (key in request.body)//post
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
	var cryptedPassword = crypto.createHash('sha256').update(request.body["txtPassword"]).digest('base64');
	var logged = false;
	
	
	
	sqlite.verbose();
	var db = new sqlite.Database("./Database/myDatabase.db");
	var index = -1;
	var userType="";
	db.serialize(function(){
		
		if (utente != undefined && cryptedPassword != undefined)
		{
			var sql = "SELECT * FROM Users WHERE Username='" + utente + "' AND Password = '" + cryptedPassword + "'";
			
			db.each(sql, function(err, row)
			{
				index = row.Id;
				userType=row.Type
			},
			function(err, nRecord)
			{
				if (index != -1)
				{
					if(userType=="normal"){
						request.session.admin=false;
					}
					else{
						request.session.admin=true;
					}
					logged = true;
					var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
					utility.aggiornaPagina("./pages/newIndex.html", function(window){
						//response.writeHead(200,header);
						response.send(window.document.documentElement.innerHTML);
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

//LOGIN MOBILE -- PARAMETRI DIVERSI
app.get("/loginmobile", function (request, response, next) {
    var utente = request.query["username"];
	var cryptedPassword = crypto.createHash('sha256').update(request.query["password"]).digest('base64');
	var logged = false;
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	sqlite.verbose();
	var db = new sqlite.Database("./Database/myDatabase.db");
	var index = -1; var ok = false;
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
					ok = true;
					yulresponse.writeHead(200, header);
					response.end("success");
				}
				else
				{
					console.log("dati errati");
					response.writeHead(200, header);
					response.end("failure");
				}
			});	
		}
	});	
});

/*********************/

app.post("/artworkDetails",function(request,response,next)
{
	/*var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	utility.aggiornaPagina("./pages/index.html", function(window){
		response.send(window.document.documentElement.innerHTML);
	});*/
	
	
	
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	request.session.idArtwork=request.body["codice"];
	utility.aggiornaPagina("./pages/singleArtwork.html", function(window){
		//response.writeHead(200,header);
		response.send(window.document.documentElement.innerHTML);
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
app.post('/api/photo',multipartMiddleware,function(request,response){
	var serverPath = '/public/img/immagini/' + request.files.userPhoto.name;
	require('fs').rename(
		request.files.userPhoto.path,
		'C:/Users/Hp Notebook/Desktop/QrReaderProject1104'+serverPath,
		function(error){
			if(error){
				response.send({
					error: 'Ah crap! Something bad happened'
				});
				return;
			}
			response.send({
				path: serverPath
			});
		}
    );
});
app.post('/api/parallax',multipartMiddleware,function(request,response){
	console.log(request.files.userPhoto.name);
	var serverPath = '/public/img/parallax/' + request.files.userPhoto.name;
	require('fs').rename(
		request.files.userPhoto.path,
		'C:/Users/Hp Notebook/Desktop/QrReaderProject1104'+serverPath,
		function(error){
			if(error){
				response.send({
					error: 'Ah crap! Something bad happened'
				});
				return;
			}
			response.send({
				path: serverPath
			});
		}
    );
});

//add artwork
app.get( "/insertArtwork", function(request, response,next){
	//load data 
	var title = request.query["title"];
	var author = request.query["author"];	
	title = title.replace("'","''");
	author=author.replace("'","''");	
	var pictureUrl = request.query["pictureUrl"];
	var pictureAbstract = request.query["pictureAbstract"];
	var NViews=0;
	var idlocation=request.query["location"];
	var tecnique=request.query["tecnique"];
	var year=request.query["year"];
	var artmovment=request.query["artmovment"];
	var altezza=request.query["altezza"];
	var larghezza=request.query["larghezza"];
	var wiki=request.query["wiki"];
	var parallaxDettaglio=request.query["parallaxdettaglio"];
	var parallaxMuseo=request.query["parallaxmuseo"];
	
	//sql
	var header = {'Content-Type' : 'text/plain', 'Cache-Control':'no-cache, must-revalidate'};
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("INSERT INTO Artworks (Title,Author,Abstract,PictureUrl,NViews,Location,Tecnique,Year,ArtMovement,DimensionHeight,DimensionWidth,WikipediaPageArtwork,PictureUrl2,PictureUrl3) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
				insert.run(title, author, pictureAbstract, pictureUrl,NViews,idlocation,tecnique,year,artmovment,altezza,larghezza,wiki,parallaxDettaglio,parallaxMuseo);
				insert.finalize();	
				response.writeHead(200,header);								
				db.close();	
	});
});

//update artwork
app.get( "/updArtwork", function(request, response,next){
	
	//load data 
	var title = request.query["title"];
	var author = request.query["author"];	
	title = title.replace("'","''");
	author=author.replace("'","''");	
	var pictureUrl = request.query["pictureUrl"];
	var pictureAbstract = request.query["pictureAbstract"];
	var NViews=0;
	var idlocation=request.query["location"];
	var tecnique=request.query["tecnique"];
	var year=request.query["year"];
	var artmovment=request.query["artmovment"];
	var altezza=request.query["altezza"];
	var larghezza=request.query["larghezza"];
	var wiki=request.query["wiki"];
	var parallaxDettaglio=request.query["parallaxdettaglio"];
	var parallaxMuseo=request.query["parallaxmuseo"];
	
	//sql
	var header = {'Content-Type' : 'text/plain', 'Cache-Control':'no-cache, must-revalidate'};
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
			if(pictureUrl!='' && parallaxDettaglio!='' && parallaxMuseo!=''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',PictureUrl='"+pictureUrl+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl2='"+parallaxDettaglio+"',PictureUrl3='"+parallaxMuseo+"' where Title='"+title+"'");								
			}
			else if(pictureUrl=='' && parallaxDettaglio!='' && parallaxMuseo!=''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl2='"+parallaxDettaglio+"',PictureUrl3='"+parallaxMuseo+"' where Title='"+title+"'");										
			}		
			else if(pictureUrl!='' && parallaxDettaglio=='' && parallaxMuseo!=''){
						var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',PictureUrl='"+pictureUrl+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl3='"+parallaxMuseo+"' where Title='"+title+"'");								
			}			
			else if(pictureUrl!='' && parallaxDettaglio!='' && parallaxMuseo==''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',PictureUrl='"+pictureUrl+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl2='"+parallaxDettaglio+"' where Title='"+title+"'");										
			}		
			else if(pictureUrl=='' && parallaxDettaglio=='' && parallaxMuseo!=''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl3='"+parallaxMuseo+"' where Title='"+title+"'");										
			}		
			else if(pictureUrl!='' && parallaxDettaglio=='' && parallaxMuseo==''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',PictureUrl='"+pictureUrl+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"' where Title='"+title+"'");										
			}			
			else if(pictureUrl=='' && parallaxDettaglio!='' && parallaxMuseo==''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"',PictureUrl2='"+parallaxDettaglio+"' where Title='"+title+"'");										
			}			
			else if(pictureUrl=='' && parallaxDettaglio=='' && parallaxMuseo==''){
				var insert=db.prepare("update artworks set Author="+author+",Abstract='"+pictureAbstract+"',NViews=0,Location="+idlocation+",Tecnique='"+tecnique+"',Year='"+year+"',ArtMovement='"+artmovment+"',DimensionHeight='"+altezza+"',DimensionWidth='"+larghezza+"',WikipediaPageArtwork='"+wiki+"' where Title='"+title+"'");										
			}		
			
		insert.run();
		insert.finalize();	
		response.writeHead(200, header);
		response.end("record aggiornato");								
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

//one artwork info
app.get("/oneArtwork", function(request, response,next){
	console.log(request.session.idArtwork);
	var id = request.session.idArtwork;
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
					artwork.type=request.session.admin;
					artwork.idAuthor = request.session.admin;
					artwork.name = row.Name;
					artwork.wikipediaPageAuthor = row.WikipediaPageAuthor;
					artwork.nationalityAuthor = row.NationalityAuthor;
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
				artwork.dimensionHeight = row.DimensionHeight;
				artwork.dimensionWidth = row.DimensionWidth;
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
app.get("/similarArtworks", function(request, response,next)
{
    //utility.aggiornaPagina("./pages/index.html", function(window){
		
	var author = request.query["author"];
	var title = request.query["title"];
	
	title = title.replace("'","''");
	author =author.replace("'","''");
	
	var artMovement = request.query["artMovement"];
	
	var header = {"Content-Type":"text/html"};	
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
	var sql = "SELECT * FROM Artworks,Authors WHERE Artworks.Author = Authors.idAuthors AND (Authors.idAuthors = '" + author + "' OR ArtMovement='"+ artMovement +"') And (Title != '" + title +"') ORDER BY NViews DESC LIMIT 3 ";
	console.log(sql);
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
				console.log(json);
				response.end(json);								
			});
			db.close();	
	}); 
	//});
});


//SUGGERIMENTI SIMIL GOOGOLE
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

//get authors
app.get("/getAuthors", function(request, response,next) {
	utility.aggiornaPagina("./pages/index.html", function(window){
	var header = {"Content-Type":"text/html"};	
	var $ = window.$;
	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
		var sql = "SELECT * from Authors";
        var json;
		var listArtworks = [];			
			db.each(sql, 
				function(err, row){					
					var artwork = {};
					artwork.id = row.IdAuthors;
					artwork.name = row.Name;	
					artwork.pictureUrlAuthor = row.PictureUrlAuthor;		
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

//get LocationsArtworks
app.get("/getLocations", function(request, response,next) 
{
	var header = {"Content-Type":"text/html"};	
	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
		var sql = "SELECT * from LocationsArtworks";
        var json;
		var listArtworks = [];			
			db.each(sql, 
				function(err, row){					
					var artwork = {};
					artwork.id = row.IdLocationsArtworks;
					artwork.name = row.Description;		
					artwork.city=row.City;
					artwork.nation=row.Nation;
					artwork.wikipediapagelocation=row.WikipediaPageLocation;
					artwork.address=row.Address;
					artwork.website=row.Website;
					artwork.telephone=row.Telephone;
					artwork.pictureUrl=row.PictureUrlMuseum; //modificato qui
					
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

//get artworks from location
app.get("/getArtworksFromLocation", function(request, response,next) {
	var idLocation = request.query["location"];
	var header = {"Content-Type":"text/html"};	
	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
		var sql = "SELECT * from Artworks where Location="+idLocation;
        var json;
		var listArtworks = [];			
			db.each(sql, 
				function(err, row){					
					var artwork = {};
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

//API feedback
//insert feedback
app.get("/insertFeedback", function(request, response,next) {
	var type=request.query["Type"];
	var artwork=request.query["idArtwork"];
	var approved=request.query["Approved"];
	var description=request.query["Description"];
	var username=request.query["Username"];
	var phonenumber=request.query["Phonenumber"];
	var email=request.query["Email"];
	var title=request.query["Title"];
	var dateReview=request.query["DateReview"];
	
	//sql
	var header = {'Content-Type' : 'text/plain', 'Cache-Control':'no-cache, must-revalidate'};
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
				var insert=db.prepare("INSERT INTO Feedbacks (Type,Artwork,Approved,Description,Username,Phonenumber,Email, Title, DateReview) values(?,?,?,?,?,?,?,?,?)");
				insert.run(type,artwork,approved,description,username,phonenumber,email, title, dateReview);
				insert.finalize();	
				response.writeHead(200,header);								
				db.close();	
	});
		
});

//get mobile/web feedback
app.get("/getFeedback", function(request, response,next) {
	var idartwork = request.query["idArtwork"];
	var header = {"Content-Type":"text/html"};	
		var db = new sqlite.Database("Database/myDatabase.db");
		db.serialize(function(){
			if(idartwork != -1)
			{
				var sql = "SELECT * from Feedbacks where Type='mobile' and Artwork="+idartwork+" AND Approved = '1' order by idFeedback";
			}
			else
			{
				var sql = "SELECT * from Feedbacks where Type='web' and Approved = '1' order by idFeedback desc limit 3";
			}
        var json;
		var listArtworks = [];			
			db.each(sql, 
				function(err, row){					
					var artwork = {};
					artwork.id = row.idFeedback;
					artwork.type = row.Type;
					artwork.artwork = row.Artwork;
					artwork.approved = row.Approved;
					artwork.description = row.Description;
					artwork.username = row.Username;
					artwork.phonenumber = row.Phonenumber;
					artwork.email = row.Email;
					artwork.dateReview = row.DateReview;
					artwork.title = row.Title;
										
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

//insert new user
app.post("/insertUser", function (request, response, next) {
    var username = request.body["txtUsername-SignUp"];
	var mail=request.body["txtMail-SignUp"];
	var telefono=request.body["txtTelefono-SignUp"];
	var cryptedPassword = crypto.createHash('sha256').update(request.body["txtPassword-SignUp"]).digest('base64');		
	
	sqlite.verbose();
	var db = new sqlite.Database("./Database/myDatabase.db");
	var index = -1;
	db.serialize(function()
	{
				var insert=db.prepare("INSERT INTO Users (Username,Password,LastAccess,Type,Mail) values(?,?,?,?,?)");
				insert.run(username,cryptedPassword,"","normal",mail);
				insert.finalize();	
				var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
				utility.aggiornaPagina("./pages/login.html", function(window){
						response.writeHead(200,header);						
						response.end(window.document.documentElement.innerHTML);
					});
	});
});


//NEW*********
//artwork advice - usato in home di app
app.get("/artworkAdvice", function(request, response,next)
{
    //utility.aggiornaPagina("./pages/index.html", function(window){
		
	var author = request.query["author"];
	//author =author.replace("'","''");
	var header = {"Content-Type":"text/html"};	
	var db = new sqlite.Database("Database/myDatabase.db");
	db.serialize(function(){
	var sql = "SELECT * FROM Artworks,Authors WHERE Artworks.Author = Authors.idAuthors AND (Authors.name = '" + author + "' ) ORDER BY NViews DESC LIMIT 3 ";
	console.log(sql);
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
				console.log(json);
				response.end(json);								
			});
			db.close();	
	}); 
	//});
});

//one artwork info
app.get("/oneArtworkMobile", function(request, response,next){
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

//ritorno a pagina principale se url è errato
app.use("*", function(request, response,next){
	utility.aggiornaPagina("./pages/login.html", function(window){
						//response.writeHead(200,header);
						response.send(window.document.documentElement.innerHTML);
					});
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
