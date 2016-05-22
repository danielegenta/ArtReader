var fs = require('fs');
var jsdom = require('C:/Users/danyg/AppData/Roaming/npm/node_modules/jsdom');

function _aggiornaPagina(pageHtml, callback){
	var jquery = "./pages/Utility/jquery-2.1.4.js";
	var html = fs.readFileSync(pageHtml, "utf8");//leggo file html
	jsdom.env(html, [jquery], function(err, window){
		callback(window);
	});	
}
module.exports.aggiornaPagina=_aggiornaPagina;