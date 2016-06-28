/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/
var map;
$(document).ready(function()
{	
	//allLocationMap();
	//LOGIN WINDOW - SHOW PASSWORD CHECKBOX
	$("#chkShowPassword").change(function() 
	{
		if(this.checked)
			$("#password").attr("type", "text")
		else
			$("#password").attr("type", "password")
	});
	
	$("#viewPage2").click(function()
	{
		$("#page-home").hide();
		$("#page-home-2").show();
		$('.carousel').carousel();
		if(navigator.geolocation)
			navigator.geolocation.getCurrentPosition(requestMuseumsPositions);
		else
			alert('Il browser non supporta la geolocalizzazione.');

		//ultimi artworks
		requestLatestArtworks();
		//web feedbaks
		requestWebFeedbacks();
	});
	
	/*
	*	GESTIONE MENU
	*/
	$("#navbar-login, #navbar-mobile-login").click(function()
	{
		$("#page-home").hide();
		$("#page-login").show();
		$("#page-home-2").hide();
		$("#page-aboutus").hide();
		$("#page-help").hide();
	});
	
	$("#navbar-aboutus, #navbar-mobile-aboutus").click(function()
	{
		$("#page-home").hide();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-aboutus").show();
		$("#page-help").hide();
	});

	$("#navbar-home").click(function()
	{
		$("#page-home").show();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-aboutus").hide();
		$("#page-help").hide();
	});
	
	$("#navbar-help, #navbar-mobile-help").click(function()
	{
		$("#page-aboutus").hide();
		$("#page-home").hide();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-help").show();
		$('.scrollspy').scrollSpy();
	});
	

	
	$("#viewPage1").click(function()
	{
		$("#page-home-2").hide();
		$("#page-home").show();
	});
	
	 $('.slider').slider({full_width: true, indicators: false});
	 
	 /*******************************FINE GESTIONE MENU****************/
	 

	$("#help-bottom-linkmail").click(function()
	{
		window.open('mailto:support@artreader.com?subject=RICHIESTA SUPPORTO');
	});
	
	//login - signup page
	$("#page-login-newuser-link").click(function()
	{
		$("#page-login-signin").hide();
		$("#page-login-signup").show();
	});
	
	$("#page-login-signup-alreadyuser-link").click(function()
	{
		$("#page-login-signup").hide();
		$("#page-login-signin").show();
	});

	//LOGIN E REGISTRAZIONE
	$("#btnAccess").click(function()
	{
		var user = $("#username").val();
		var pw  = $("#password").val();
		requestLogin(user, pw);
	});

		//menu mobile
	$(".button-collapse").sideNav();
});




function CheckInsertUser(){
	alert($("#insertUserUName").val()+","+$("#mail").val()+","+$("#insertUserCell").val()+","+$("#insertUserPassword1").val()+","+$("#insertUserPassword2").val());
	if($("#insertUserUName").val()!="" && $("#mail").val()!="" && $("#insertUserCell").val()!="" && $("#insertUserPassword1").val()!="" && $("#insertUserPassword2").val()!=""){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test($("#mail").val())){
			if($("#insertUserPassword1").val()==$("#insertUserPassword2").val()){
				insertUser();
				$("#insertUserUName").val();
				$("#mail").val();
				$("#insertUserCell").val();
				$("#insertUserPassword1").val();
				$("#insertUserPassword2").val();
				$("#insertUserUName").attr('class', 'validate');
				$("#mail").attr('class', 'validate');
				$("#insertUserCell").attr('class', 'validate');
				$("#insertUserPassword1").attr('class', 'validate');
				$("#insertUserPassword2").attr('class', 'validate');
			}else
				alert("Le password non corrispondono");
		}
		else
			alert("Mail non valida");
	}
}


/******************************
*	SECONDA PAGINA (MAPPE, FEEDBACK ED ULTIMI ARTWORK)
*******************************/

//creare un marker per ogni museo sfruttando API
function requestMuseumsPositions(response) 
{	
	
	latlng = new google.maps.LatLng(50,10);
	
	var opzioni=
	{
		zoom: 3,
		center:latlng,
		mapTypeControl:false,
		mapTypeControlOption:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
		navigationControl:false,
		navigationControlOption:{Style:google.maps.NavigationControlStyle.SMALL},
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var mapDiv=document.getElementById('museumMap');
	map = new google.maps.Map(mapDiv,opzioni);

	showMuseumsPositions();
}

//creo marker
function makeMarker(latlng,map,title){
	var marker=new google.maps.Marker({
	position:latlng,
	map:map,
	title: title
	});
}

function getCoords(address,map,title)
{
	var gc      = new google.maps.Geocoder(),
		opts    = { 'address' : address };

	gc.geocode(opts, function (results, status)
	{
		console.log(opts);
		if (status == google.maps.GeocoderStatus.OK)
		{   
			var loc     = results[0].geometry.location,
				lat     = results[0].geometry.location.lat(),
				lon    = results[0].geometry.location.lng();
		
			latlng = new google.maps.LatLng(lat,lon);
	
			makeMarker(latlng,map, title);
			
		}
	});
}

function loadMuseumsPositions(response, i)
{
	var address = response[i].address;
	var title = response[i].description;
	getCoords(address, map, title);
}


//Ultimi Artwork (carosello)
function requestLatestArtworks()
{
	showLatestArtworks();
}

function loadLatestArtworks(response, i)
{
	if (i<5)
	{
		var img = response[i].pictureUrl;
		var id = "home-carousel-"+i;
		$("#"+id).attr("src", "img/immagini/"+img);
	}
}

//feedback
//Ultimi Artwork (carosello)
function requestWebFeedbacks()
{
	showWebFeedbacks();
}

function loadWebFeedbacks(response, i)
{
	if (i<3)
	{
		var title = response[i].title;
		var description = response[i].description;
		var author = response[i].username;
		var id = "home-webFeedback-"+i;

		$("#"+id).html("<b>" + title + "</b><br> \"" + description + "\" <br>"+ author);
		console.log("ciao ciao");
	}
}
