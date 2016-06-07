
/******************************************************
*		SINGLE PAGE AUTHOR.HTML
*******************************************************/
//PRINT SINGLE AUTHOR DETAIL in singleAuthor.html
var map;
var latlng;
$(document).ready(function()
{
	showSingleLocationInfo();

	if(navigator.geolocation)
			navigator.geolocation.getCurrentPosition(mia_posizione);
	else
			alert('Il browser non supporta la geolocalizzazione');
});

function printLocationDetails(location)
{
	$("#lblLocationDescription, #infoHeader").text(location.description);
	$("#lblLocationCity").text(location.city);
	$("#lblLocationNation").text(location.nation);
	$("#lblWikipediaPageLocation").attr("href", location.wikipediaPageLocation);
	$("#lblLocationAddress").text(location.address);
	$("#lblLocationPhone").text(location.telephone);
	$("#lblLocationWebsite").text(location.website);
	$("#lblLocationWebsite").attr("href", location.website);
	$("#imgLocation").attr("src", "img/parallax/"+location.pictureUrlMuseum);

	mostFamousArtworks(location.id)
}



function showMostFamousArtworks(response, i)
{
	var id = response[i].id;
	var title = response[i].title;
	var pic = 'img/immagini/'+response[i].pictureUrl;
	var height = response[i].dimensionHeight;
	var width = response[i].dimensionWidth;
	console.log(height, width);
	if (i==0)
	{
		$("#txtNoMostFamousArtworks").hide();
	}
	switch (i)
	{
		case 0:
			asignImage("#imgMostFamousArtworks1", pic, height, width);
			$("#imgMostFamousArtworks1_caption").text(title);
			$("#imgMostFamousArtworks1, #imgMostFamousArtworks1_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 1:
			asignImage("#imgMostFamousArtworks2", pic, height, width);
			$("#imgMostFamousArtworks2_caption").text(title);
			$("#imgMostFamousArtworks2, #imgMostFamousArtworks2_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 2:
			asignImage("#imgMostFamousArtworks3", pic, height, width);
			$("#imgMostFamousArtworks3_caption").text(title);
			$("#imgMostFamousArtworks3, #imgMostFamousArtworks3_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 3:
			asignImage("#imgMostFamousArtworks4", pic, height, width);
			$("#imgMostFamousArtworks4_caption").text(title);
			$("#imgMostFamousArtworks4, #imgMostFamousArtworks4_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 4:
			asignImage("#imgMostFamousArtworks5", pic, height, width);
			$("#imgMostFamousArtworks5_caption").text(title);
			$("#imgMostFamousArtworks5, #imgMostFamousArtworks5_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
	}
}

/*
*	NEW
*/
//used to resize programatically images
function asignImage(id, pic, height, width)
{
	var nHeight=250, nWidth=250;
	if ((height >= width) && (height - width<=10))
	{
		nHeight = 250; nWidth = 250;
	}
	else if ((height > width) && (height - width>=10))
	{
		nHeight = 250; nWidth = 200;
	}
	else if ((height < width) && (width - height>=10))
	{
		nHeight = 200; nWidth = 250;
	}
	
	$(id).attr("src", pic);
	$(id).attr("width", nWidth+"px");
	$(id).attr("height", nHeight+"px");
}

//MAP
function mia_posizione(position) 
{

	getCoords($("#lblLocationAddress").text());
	latlng = new google.maps.LatLng(0,0);
	var opzioni={
		zoom:10,
		center:latlng,
		mapTypeControl:true,
		mapTypeControlOption:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
		navigationControl:true,
		navigationControlOption:{Style:google.maps.NavigationControlStyle.SMALL},
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var mapDiv=document.getElementById('museumMap');
	map = new google.maps.Map(mapDiv,opzioni);

	makeMarker(latlng);
	}

	//creo marker
	function makeMarker(latlng){
		var marker=new google.maps.Marker({
		position:latlng,
		map:map,
		title:''
	});
}
		
function getCoords(address)
{
console.log(address);
	var gc      = new google.maps.Geocoder(),
		opts    = { 'address' : address };

	gc.geocode(opts, function (results, status)
	{
		if (status == google.maps.GeocoderStatus.OK)
		{   
			var loc     = results[0].geometry.location,
				lat     = results[0].geometry.location.lat(),
				lon    = results[0].geometry.location.lng();
		
			latlng = new google.maps.LatLng(lat,lon);
			var opzioni={
			zoom:15,
			center:latlng,
			mapTypeControl:true,
			mapTypeControlOption:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
			navigationControl:true,
			navigationControlOption:{Style:google.maps.NavigationControlStyle.SMALL},
			mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			
			var mapDiv=document.getElementById('museumMap');
			map = new google.maps.Map(mapDiv,opzioni);

			makeMarker(latlng);
			
		}
	});
}	