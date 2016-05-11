/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	
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
			navigator.geolocation.getCurrentPosition(mia_posizione);
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

//creare un marker per ogni museo sfruttando API
function mia_posizione(position) 
{	
	latlng = new google.maps.LatLng(44,7);
	
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
	map = new google.maps.Map(mapDiv,opzioni);
}