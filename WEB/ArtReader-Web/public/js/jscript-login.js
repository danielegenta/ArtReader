/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

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
			navigator.geolocation.getCurrentPosition(mia_posizioneMapMusei);
		else
			alert('Il browser non supporta la geolocalizzazione.');
	});
	
	/*
	*	GESTIONE MENU
	*/
	$("#navbar-login, #navbar-mobile-login").click(function()
	{
		$("#page-home").hide();
		$("#page-login").show();
		$("#page-home-2").hide();
		$("#page-feedback").hide();
		$("#page-help").hide();
	});
	

	$("#navbar-home").click(function()
	{
		$("#page-home").show();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-feedback").hide();
		$("#page-help").hide();
	});
	
	$("#navbar-feedback, #navbar-mobile-feedback").click(function()
	{
		$("#page-home").hide();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-help").hide();
		$("#page-feedback").show();
	});
	
	$("#navbar-help, #navbar-mobile-help").click(function()
	{
		$("#page-home").hide();
		$("#page-login").hide();
		$("#page-home-2").hide();
		$("#page-feedback").hide();
		$("#page-help").show();
		$('.scrollspy').scrollSpy();
	});
	
	//menu mobile
	$(".button-collapse").sideNav();
	
	$("#viewPage1").click(function()
	{
		$("#page-home-2").hide();
		$("#page-home").show();
	});
	
	 $('.slider').slider({full_width: true, indicators: false});
	 
	 /*******************************FINE GESTIONE MENU****************/
	 
	 //mail feedback
	 $("#feedback-bottom-linkmail").click(function()
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
});


function sendFeedBack(){
	if($("#icon_prefix1").val()!="" && $("#icon_telephone").val()!="" && $("#icon_prefix2").val()!="" && $("#icon_prefix3").val()!=""){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test($("#icon_prefix2").val()))
			{
				sendfeedback("web","",$("#icon_prefix3").val(),$("#icon_prefix1").val(),$("#icon_telephone").val(),$("#icon_prefix2").val());
				$("#icon_prefix1").val("");
				$("#icon_telephone").val("");
				$("#icon_prefix2").val("");
				$("#icon_prefix3").val("");
				
				$("#icon_prefix1").attr('class', 'validate');
				$("#icon_telephone").attr('class', 'validate');;
				$("#icon_prefix2").attr('class', 'validate');
			}
			else
				alert("Mail non valida");		
	}
}

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
//creare un marker per ogni museo sfruttando API
function mia_posizioneMapMusei(response) 
{	
	
	latlng = new google.maps.LatLng(0,0);
	
	var opzioni=
	{
		zoom: 2,
		center:latlng,
		mapTypeControl:false,
		mapTypeControlOption:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
		navigationControl:false,
		navigationControlOption:{Style:google.maps.NavigationControlStyle.SMALL},
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var mapDiv=document.getElementById('museumMap');
	var map = new google.maps.Map(mapDiv,opzioni);
	console.log(response[0].address);
	var pos=response[0].address;
getCoords(pos,map);	
	/*for(var key in response){
		console.log(response[key].address);
	getCoords(response[key].address,map);
	}*/
	//makeMarker(latlng);
	
}
//creo marker
		function makeMarker(latlng,map){
			var marker=new google.maps.Marker({
			position:latlng,
			map:map,
			title:''
			});
		}
		function getCoords(address,map)
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
			
					makeMarker(latlng,map);
					
				}
			});
		}