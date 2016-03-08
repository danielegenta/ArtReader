// Dichiarazione dell'oggetto listener
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var jsdom = require('C:/Users/danyg/AppData/Roaming/npm/node_modules/jsdom');

var listener={
	risorsa:"", // E' la risorsa richiesta dal client 
	// Funzione eseguita in corrispondenza della richiesta della risorsa
	callback: function(request, response) { }
};

var Dispatcher = function(){
	this.prompt = "[NODE] >> "; // Utile per la visualizzazione dei messaggi in console
	
	// LiteralObject con all'interno due vettori get e post
	// Il vettore get conterrà listener di tipo get
	// Il vettore post conterrà listener di tipo post
	this.list={
		get : [ ],
		post : [ ]
	};
	
	this.addListener = function(method, risorsa, callback) {
		var listener = {"risorsa" : risorsa, "callback" : callback};
		// Si può anche usare :
		// this.list[method].push(listener);
		method = method.toLowerCase();
		if(method=="get")
			this.list.get.push(listener);
		else
			this.list.post.push(listener);
			
	};
	
	this.showList = function() {
		console.log("Elenco Listener ----------")
		// Method nome della variabile di ciclo
		// Il ciclo scandisce tutti i campi dell'oggetto list
		for(method in this.list) {
			console.log("Il metodo " + method + "contiene" + this.list[method].length + "listener");
			// listener non è object ma un val del vettore method
			for(listener in this.list[method]) {
				console.log("Listener : " + this.list[method][listener].risorsa);
				//console.log("Listener : " + listener.risorsa); NON FUNZIONA
			}
		}
	};
}

// Prototype consente di aggiungere nuovi metodi ad un LiteralObject creato tramite costruttore
Dispatcher.prototype.dispatch = function (request, response) {
	// Recupero metodo e risorsa e li visualizzo
	var method = request.method.toLowerCase();
	var risorsa = url.parse(request.url).pathname;
	console.log(this.prompt + method + " - "+ risorsa);
	
	// Lettura parametri
	var parametri;
	if(method == "get") {
		// Per default, senza settare il parametro a true, url.parse non legge la queryString
		parametri = url.parse(request.url, true).query;
		request.parametriGet = parametri; // Aggiunge un nuovo campo get all'oggetto request
	}
	else if(method == "post") {
		//non essendo un url parsifichiamo con querryString per trasformare i parametri post da stringa in object		
		parametri = qs.parse(request.parametriPost);
		request.parametriPost = parametri;
	}
	console.log(parametri);
	// Ricerca di un Listener dinamico (resitutisce una risorsa dinamica. No file)
	var trovato = false;
	for(var listener in this.list[method])
		if(risorsa == this.list[method][listener].risorsa) {
			trovato = true;
			break;
		}
	if(trovato)
		this.list[method][listener].callback(request, response);
	else
		this.staticListener(request, response); // Ricerca i file in pages
}

// Static listener
Dispatcher.prototype.staticListener = function (request, response) {
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	var risorsa = url.parse(request.url).pathname;
	var istanza = this;
	var fileName;
	if(risorsa == '/')
		fileName = "./pages/index.html";
	else if (risorsa == "/favicon.ico") {
		fileName = "./pages/favicon.png";
		header = { 'Content-Type' : 'images/png'};
	}
	else
		fileName = "./pages" + risorsa;
	fs.readFile(fileName, function (err, data) { 
		if(!err) {
			response.writeHead(200, header);
			response.write(data);
			response.end(); //response.end(data) sostituisce le due righe
		}
		else
			istanza.errorListener(request, response);
	});
}

Dispatcher.prototype.errorListener = function(request, response) {
	var header = { 'Content-Type' : 'text/html;Charset=utf-8' };
	// Stringa con pagina da visualizzare
	// Funzione di callback eseguita al termine della lettura del file
	// Err è un booleano con true/false
	// Data contiene la pagina se è riuscita a leggerla
	fs.readFile("./pages/error.html", function (err, data) { 
		if(!err) {
			response.writeHead(404, header);
			response.write(data);
			response.end();
		}
		else {
			response.writeHead(404, header);
			response.write("Risorsa non trovata.");
			response.end();
		}
		
	});
}

// Gestione parametri post
Dispatcher.prototype.leggiPostParameters = function(request, response, callback) {
	var parametri = "";
	// Evento richiamato in corrispondenza di ogni write
	request.on("data", function(data) {
		parametri += data;
	});
	request.on("end", function(data) {
		request.parametriPost = parametri;
		callback(request, response);
	});
}

//parametro 1 pagina html da caricare 
//parametro 2 funzione da eseguire al termine del caricamento della pagina
Dispatcher.prototype.aggiornaPagina = function(pageHtml, callback){
	var jquery = "./pages/Utility/jquery-2.1.4.js";
	var html = fs.readFileSync(pageHtml, "utf8");//leggo file html
	//questa riga esegue la funzione di callback che ho ricevuto come parametro
	//e gli passa come parametro l'oggetto window che è un puntatore alla finestra corrente
	jsdom.env(html, [jquery], function(err, window){
		callback(window);
	});
	
}


module.exports = new Dispatcher();