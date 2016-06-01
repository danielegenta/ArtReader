/***********************
* Script functions (interaction with the server) - AJAX calls
************************/

var readRequest, notQueryRequest, richiestaSugg, similarRequest, similarRequestSinglePageArtwork,reqCbAuthor,reqCbLocation,feedBack;

/**************************************************************LOGIN CALLS***************************************************************/
//login to index page
function access()
{
    document.formLogin.action = "/access";  
    document.formLogin.submit();	
}

/**************************************************************INDEX CALLS***************************************************************/
/****************************************
*			CRUD 
******************************************/
function tryA(){
	console.log($("#userPhotoInput").val().split('\\').pop());
	console.log($("#pictureUrl1").val().split('\\').pop());
	console.log($("#pictureUrl2").val().split('\\').pop());
	if($("#userPhotoInput").val().split('\\').pop()!="")
	$('#uploadForm').submit();
	if($("#pictureUrl1").val().split('\\').pop()!="")
	$('#uploadForm1').submit();
	if($("#pictureUrl2").val().split('\\').pop()!="")
	$('#uploadForm2').submit();	
}
  
function upImg(){	
	notQueryRequest = new XMLHttpRequest();
	var url="/api/photo";
	notQueryRequest.open("POST", url, true);
	notQueryRequest.onreadystatechange = notQueryUpdate;
	notQueryRequest.send(null);
}
function deleteArtwork(id)
{
	notQueryRequest = new XMLHttpRequest();
	var cod =id ;
	var url="delArtwork?id="+encodeURIComponent(cod);
	notQueryRequest.open("GET", url, true);
	notQueryRequest.onreadystatechange = notQueryUpdate;
	notQueryRequest.send(null);
}

function addArtwork(tit,aut,abs,pic,nv,idloc,tec,y,artm,height,width,wiki,parallaxdesc,parallaxmus)
{
	notQueryRequest = new XMLHttpRequest();
	
	//set data
	var title =tit ;
	var author =aut ;
	var pictureAbstract =abs;
	var pictureurl=pic;
	var nview=nv;
	var idlocation=idloc;
	var tecnique=tec;
	var year=y;
	var artmovement=artm;
	var altezza=height;
	var larghezza=width;
	var wikipedia=wiki;
	var parallaxdescrizione=parallaxdesc;
	var parallaxmuseo=parallaxmus;
	
	//call insert api
	var url="insertArtwork?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&pictureAbstract="+encodeURIComponent(pictureAbstract)+"&pictureUrl="+encodeURIComponent(pictureurl)+"&location="+encodeURIComponent(idlocation)+"&tecnique="+encodeURIComponent(tecnique)+"&year="+encodeURIComponent(year)+"&artmovment="+encodeURIComponent(artmovement)+"&altezza="+encodeURIComponent(altezza)+"&larghezza="+encodeURIComponent(larghezza)+"&wiki="+encodeURIComponent(wiki)+"&parallaxdettaglio="+encodeURIComponent(parallaxdescrizione)+"&parallaxmuseo="+encodeURIComponent(parallaxmuseo);
	notQueryRequest.open("GET", url, true);
	notQueryRequest.onreadystatechange = notQueryUpdate;
	notQueryRequest.send(null);
	
}

function updateArtwork(tit,aut,abs,pic,nv,idloc,tec,y,artm,height,width,wiki,parallaxdesc,parallaxmus)
{
	notQueryRequest = new XMLHttpRequest();
	
	//set data
	var title =tit ;
	var author =aut ;
	var pictureAbstract =abs;
	var pictureurl=pic;
	var nview=nv;
	var idlocation=idloc;
	var tecnique=tec;
	var year=y;
	var artmovement=artm;
	var altezza=height;
	var larghezza=width;
	var wikipedia=wiki;
	var parallaxdescrizione=parallaxdesc;
	var parallaxmuseo=parallaxmus;
	
	//call insert api
	var url="updArtwork?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&pictureAbstract="+encodeURIComponent(pictureAbstract)+"&pictureUrl="+encodeURIComponent(pictureurl)+"&location="+encodeURIComponent(idlocation)+"&tecnique="+encodeURIComponent(tecnique)+"&year="+encodeURIComponent(year)+"&artmovment="+encodeURIComponent(artmovement)+"&altezza="+encodeURIComponent(altezza)+"&larghezza="+encodeURIComponent(larghezza)+"&wiki="+encodeURIComponent(wiki)+"&parallaxdettaglio="+encodeURIComponent(parallaxdescrizione)+"&parallaxmuseo="+encodeURIComponent(parallaxmuseo);
	notQueryRequest.open("GET", url, true);
	notQueryRequest.onreadystatechange = notQueryUpdate;
	notQueryRequest.send();
}

function post(path, params) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/artworkDetails");

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
         }
    }
    document.body.appendChild(form);
    form.submit();
}

/************************* END CRUD ******************************/

/****************************
*	RESEARCH AND READING API
*****************************/

function showArtworks()
{
	console.log("k");
	readRequest = new XMLHttpRequest();
	var url="/allArtworks";
	readRequest.open("GET", url, true);
	readRequest.onreadystatechange = readUpdate;
	readRequest.send(null);
}



function searchArtworks(partial)
{
	readRequest = new XMLHttpRequest();
	var title =partial;
	var author = partial;
	var url="/searchArtwork?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author);
	readRequest.open("GET", url, true);
	readRequest.onreadystatechange = readUpdate;
	readRequest.send(null);
}

function similarArtworks(auth, tit, artM)
{
	similarRequest = new XMLHttpRequest();
	var author = auth;
	var title = tit;
	var artMovement = artM;
	var url="/similarArtworks?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&artMovement="+encodeURIComponent(artMovement);
	
	similarRequest.open("GET", url, true);
	similarRequest.onreadystatechange = similarArtworksUpdate;
	similarRequest.send(null);
}

function allAuthors(){
	console.log("wala2");
	reqCbAuthor = new XMLHttpRequest();
	var url="/getAuthors";
	reqCbAuthor.open("GET", url, true);
	reqCbAuthor.onreadystatechange = caricacomboAuthors;
	reqCbAuthor.send(null);
}
function allLocation(){
	reqCbLocation = new XMLHttpRequest();
	var url="/getLocations";
	reqCbLocation.open("GET", url, true);
	reqCbLocation.onreadystatechange = caricacomboLocation;
	reqCbLocation.send(null);
}
function allLocationMap(){
	reqCbLocation = new XMLHttpRequest();
	var url="/getLocations";
	reqCbLocation.open("GET", url, true);
	reqCbLocation.onreadystatechange = caricaMap;
	reqCbLocation.send(null);
}
/**********************
*	AFTER QUERY/NOT QUERY calls
***********************/
function caricacomboAuthors(){
	if (reqCbAuthor.readyState == 4 && reqCbAuthor.status == 200)
	{
		var response = JSON.parse(reqCbAuthor.responseText);
		var artworks = response;
		cbAuthors(artworks);		
	}
}
function caricaMap(){
	if (reqCbLocation.readyState == 4 && reqCbLocation.status == 200)
	{
		var response = JSON.parse(reqCbLocation.responseText);
		//for(var key in response){
			
			mia_posizioneMapMusei(response);
	
		// }
				
	}
}
function caricacomboLocation(){
	if (reqCbLocation.readyState == 4 && reqCbLocation.status == 200)
	{
		var response = JSON.parse(reqCbLocation.responseText);
		var artworks = response;
		cbLocations(artworks);		
	}
}
function readUpdate()
{
	if (readRequest.readyState == 4 && readRequest.status == 200)
	{
		console.log(readRequest.responseText);
		var response = JSON.parse(readRequest.responseText);
		var artworks = response;
		var i = 0;
		cleanTable();
		for (var counter in artworks)
		{
			showArtwork(artworks, i);
			i++;
		}
	}
}



function notQueryUpdate()
{
	if (notQueryRequest.readyState == 4 && notQueryRequest.status == 200)
	{
		var response = notQueryRequest.responseText;
	}
}

function similarArtworksUpdate()
{
	if (similarRequest.readyState == 4 && similarRequest.status == 200)
	{
		var response = JSON.parse(similarRequest.responseText);
		var artworks = response;
		console.log(response);
		var i = 0;
		cleanSimilar();
		for (var counter in artworks)
		{
			showSimilar(artworks, i);
			i++;
		}
		if (i == 0)
			showSimilar("", -1);
	}
}
/*****************END AFTER Q/NQ ***********************/

/*************************************************
******************************************************************************Single PAGE ARTWORK calls*********************************
***************************************************/
function relatedArtworks_SinglePageArtwork(auth, tit, artM)
{
	similarRequestSinglePageArtwork = new XMLHttpRequest();
	var author = auth;
	var title = tit;
	var artMovement = artM;
	var url="/similarArtworks?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&artMovement="+encodeURIComponent(artMovement);
	similarRequestSinglePageArtwork.open("GET", url, true);
	similarRequestSinglePageArtwork.onreadystatechange = relatedArtworksUpdate;
	similarRequestSinglePageArtwork.send(null);
}

function relatedArtworksUpdate()
{
	if (similarRequestSinglePageArtwork.readyState == 4 && similarRequestSinglePageArtwork.status == 200)
	{
		var response = JSON.parse(similarRequestSinglePageArtwork.responseText);
		var artworks = response;
		var i = 0;
		console.log(artworks)
		for (var counter in artworks)
		{
			showRelated_SinglePageArtwork(artworks, i);
			i++;
		}
	}
}

function showSingleArtworkInfo()
{
	//var idArtwork = id;
	readRequest = new XMLHttpRequest();
	var url="/oneArtwork";
	//id="+encodeURIComponent(idArtwork);
	readRequest.open("GET", url, true);
	readRequest.onreadystatechange = singleArtworkUpdate;
	readRequest.send(null);
}

function sendfeedback(type,artwork,description,username,phonenumber,email){
	var Type=type;
	var Description=description;
	var Username=username;
	var Phonenumber=phonenumber;
	var Email=email;
	var Artwork=artwork;		
	feedBack = new XMLHttpRequest();
	var url="/insertFeedback?Tipo="+encodeURIComponent(Type)+"&Artwork="+encodeURIComponent(Artwork)+"&Description="+encodeURIComponent(Description)+"&Username="+encodeURIComponent(Username)+"&Phonenumber="+encodeURIComponent(Phonenumber)+"&Email="+encodeURIComponent(Email)+"";
	feedBack.open("GET", url, true);
	feedBack.onreadystatechange = notQueryUpdate;
	feedBack.send(null);
}

function insertUser(){
	document.frmSignUp.submit();
}

function singleArtworkUpdate()
{
	if (readRequest.readyState == 4 && readRequest.status == 200)
	{
		console.log(readRequest.responseText);
		var response = JSON.parse(readRequest.responseText);
		var artwork = response;
		
		printArtworkDetails(artwork);
	}
}


/********************
* 	end single page artwork calls
*/



//!! DA MODIFICARE!!!!!!!!!!!! - USARE JQUERY, SCRIVER IN INGLESE...
/////////////////////////////suggerimenti google - da modificare (magari intefeare in similar artworks)
function ricerca()
{
    richiestaSugg = new XMLHttpRequest();
    var valore = document.getElementById("txtSearch").value;
    var url = "completion?parolaCercata=" + encodeURIComponent(valore);
	richiestaSugg.open("get", url, true);
	richiestaSugg.onreadystatechange = aggiornaPag;
	richiestaSugg.send(null);
}

function aggiornaPag()
{
    if(richiestaSugg.readyState == 4 && richiestaSugg.status == 200)
    {
        var risposta = JSON.parse(richiestaSugg.responseText); // readRequest arrivata dal server
        console.log(risposta);
        var tab = document.getElementById("lstSuggerimenti");
            tab.innerHTML = "";
            tab.style.display = "none";
        if(risposta != "")
        {
            tab.style.height = (21 * risposta.length) + "pt";
            for(var i=0; i<risposta.length; i++)
            {
                var riga = document.createElement("option");
                riga.textContent = risposta[i].voce;
                
                tab.appendChild(riga);
            }
            tab.style.display = "block";
        }
    }
}



