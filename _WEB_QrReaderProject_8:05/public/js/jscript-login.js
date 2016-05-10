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
	
	if(navigator.geolocation)
		navigator.geolocation.getCurrentPosition(mia_posizione);
	else
		alert('Il browser non supporta la geolocalizzazione.');
	$("#viewPage2").click(function()
	{
		$("#page1").hide();
		$('.carousel').carousel();
		$("#page2Bis").show();
	});
	
	/*
	*	GESTIONE MENU
	*/
	$("#navbar-login, #navbar-mobile-login").click(function()
	{
		$("#page1").hide();
		$("#page2").show();
		$("#page2Bis").hide();
		$("#page-feedback").hide();
		$("#page-help").hide();
	});
	

	$("#navbar-home").click(function()
	{
		$("#page1").show();
		$("#page2").hide();
		$("#page2Bis").hide();
		$("#page-feedback").hide();
		$("#page-help").hide();
	});
	
	$("#navbar-feedback, #navbar-mobile-feedback").click(function()
	{
		$("#page1").hide();
		$("#page2").hide();
		$("#page2Bis").hide();
		$("#page-help").hide();
		$("#page-feedback").show();
	});
	
	$("#navbar-help, #navbar-mobile-help").click(function()
	{
		$("#page1").hide();
		$("#page2").hide();
		$("#page2Bis").hide();
		$("#page-feedback").hide();
		$("#page-help").show();
		$('.scrollspy').scrollSpy();
	});
	
	//menu mobile
	$(".button-collapse").sideNav();
	
	$("#viewPage1").click(function()
	{
		$("#page2Bis").hide();
		$("#page1").show();
	});
	
	 $('.slider').slider({full_width: true, indicators: false});
	 
	 /*******************************FINE GESTIONE MENU****************/
	 
	 //mail feedback
	 $("#feedback-bottom-linkmail").click(function()
	{
		window.open('mailto:support@artreader.com?subject=RICHIESTA SUPPORTO');
	});
});

function mia_posizione(position) 
{	
	latlng = new google.maps.LatLng(44,7);
	
	var opzioni={
	zoom:8,
	center:latlng,
	mapTypeControl:true,
	mapTypeControlOption:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR},
	navigationControl:true,
	navigationControlOption:{Style:google.maps.NavigationControlStyle.SMALL},
	mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var mapDiv=document.getElementById('museumMap');
	map = new google.maps.Map(mapDiv,opzioni);
}