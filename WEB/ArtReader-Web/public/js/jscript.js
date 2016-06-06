/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	

	//menù
	$("#navbar-feedback, #navbar-mobile-feedback").click(function()
	{
		$("#page1").hide();
		$("#page-help").hide();
		$("#page-feedback").show();
		$("#after-feedback-content").hide();
		$("#feedback-content").hide();
	});	

	$("#navbar-help, #navbar-mobile-help").click(function()
	{
		$("#page1").hide();
		$("#page-feedback").hide();
		$("#page-help").show();
	});
	$("#navbar-home").click(function()
	{
		$("#page1").show();
		$("#page-feedback").hide();
		$("#page-help").hide();
	});
	$("#navbar-logout, #navbar-mobile-logout").click(function()
	{
		//chiamata a scriptjs
		logout();
	});

	//feedback page
	 //mail feedback
 	$("#feedback-bottom-linkmail").click(function()
	{
		window.open('mailto:support@artreader.com?subject=RICHIESTA FEEDBACK');
	});

	 //help page
	 $("#help-bottom-linkmail").click(function()
	{
		window.open('mailto:support@artreader.com?subject=RICHIESTA SUPPORTO');
	});

//upload
$('#uploadForm').submit(function() {
        console.log('uploading the file ...');
        $(this).ajaxSubmit({
            dataType: 'text',
            error: function(xhr) {
               console.log('Error: ' + xhr.status);
            },
            success: function(response) {
                try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                   console.log('Bad response from server');
                    return;
                }
                if(response.error) {
                    console.log('Oops, something bad happened');
                    return;
                }
            }
        });
        return false;
    });
	$('#uploadForm1').submit(function() {
        console.log('uploading the file ...');
        $(this).ajaxSubmit({
            dataType: 'text',
            error: function(xhr) {
               console.log('Error: ' + xhr.status);
            },
            success: function(response) {
                try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                   console.log('Bad response from server');
                    return;
                }
                if(response.error) {
                    console.log('Oops, something bad happened');
                    return;
                }
            }
        });
        return false;
    });
	$('#uploadForm2').submit(function() {
        console.log('uploading the file ...');
        $(this).ajaxSubmit({
            dataType: 'text',
            error: function(xhr) {
               console.log('Error: ' + xhr.status);
            },
            success: function(response) {
                try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                   console.log('Bad response from server');
                    return;
                }
                if(response.error) {
                    console.log('Oops, something bad happened');
                    return;
                }
            }
        });
        return false;
    });


	//IMAGE anteprima
	$('input[name=userPhoto]').change(function(){
        readURL(this);
    });
		function readURL(input) {
		switch(input.id){
			case "userPhotoInput":
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				
				reader.onload = function (e) {
					$('#showImg').attr('src', e.target.result);
				}			
				reader.readAsDataURL(input.files[0]);
				console.log(input.files[0]);
			}
			break;
			case "pictureUrl1":
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				
				reader.onload = function (e) {
					$('#showImg1').attr('src', e.target.result);
				}			
				reader.readAsDataURL(input.files[0]);
				console.log(input.files[0]);
			}
			break;
			case "pictureUrl2":
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				
				reader.onload = function (e) {
					$('#showImg2').attr('src', e.target.result);
				}			
				reader.readAsDataURL(input.files[0]);
				console.log(input.files[0]);
			}
			break;
		}       
    }
	//gestione combobox
	$('select').material_select();
	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of buttons
    }
  );
  
	//INSERT NEW ARTWORK var and fields
	var dialog, form,
      title = $( "#txtTitle" ),
      pictureAbstract = $( "#txtAbstract" ),
	  img=$("#showImg"),
	  imgPath=$("#userPhotoInput"),
	  img1=$("#showImg1"),
	  imgPath1=$("#pictureUrl1"),
	  img2=$("#showImg2"),
	  imgPath2=$("#pictureUrl2"),
	  tecnique = $( "#txtTecnique" ),
	  movimento = $( "#txtMovimento" ),
	  wiki=$( "#txtWiki" ),
	  anno=$( "#txtAnno" ),
	  altezza=$( "#txtAltezza" ),
	  larghezza=$( "#txtLarghezza" ),
	  cbAuthor=$("#cbAuthor"),
	  cbLocation=$("#cbLocation");
      allFields = $( [] ).add( title ).add( cbAuthor ).add( pictureAbstract ).add(imgPath).add(imgPath1).add(imgPath2).add(tecnique).add(movimento).add(wiki).add(anno).add(altezza).add(larghezza).add(cbLocation),
	  tips = $( ".validateTips" );
	  
	//first loading of the artworks table
	jqShowArtworks();
	jqShowLocations();
	jqShowAuthors();
	
	$("#searchTips").hide();
	$(".riga").hide();
	$("#noTip").hide();

	//ARTWORK dialog
	dialog = $( "#dialogInsertArtwork" ).dialog({
		 autoOpen: false,
		  height: 900,
		  width: 800,
		  modal: true,
		  buttons: {
			  "Modifica": 
			{
				id: "btnModifica",
				text: "Modifica",
				click:function(){
					checkArtwork("mod");
					console.log($("#userPhotoInput").val().split('\\').pop());
				}		
			},			
			"Inserisci": 
			{
				id: "btnInsert",
				text: "Inserisci",
				click:function(){
				checkArtwork("add");
				}
			},			
			"Chiudi": 
			function() {
			  dialog.dialog( "close" );
			}
		  },
		  close: function() {
			allFields.removeClass( "ui-state-error" );
			jqShowArtworks();
		  },
		  open: function(){
			allAuthors();  
			allLocation();
		  }
	});


	
	
	//RESERACH 
	$("txtSearch").focus(function() { $(this).select(); } );
	 $("input:text").click(function() { $(this).select(); } );
	//called when i type on txtSearch
	$( "#txtSearch" ).keyup(function() {
		cleanTable();
		cleanTableLocations();
		cleanTableAuthors();
		var stringSearch = $("#txtSearch").val();
		$(".riga").show();
		refreshTable(stringSearch);
		refreshTableAuthors(stringSearch);
		refreshTableLocations(stringSearch);
		ricerca();

	});
	//RESTORE INITIAL STATUS of txtSearch
	$("#txtSearch").focusout(function()
	{
		if ($(this).val() == "" )
		{
			$(this).val("Ricerca un'opera d'arte..."); 

		}
		$("#searchTips").hide();
		$("#riga").hide();
	});

	//GOOGLE ISTANT tips
	$("#lstSuggerimenti").change(function(){
		selVal = $( "#lstSuggerimenti option:selected" ).text();
		//aux: title - author - artMovement
		var aux = selVal.split(" - ");
		$("#txtSearch").val(aux[0]);
		$(".riga").hide();
		refreshTable(aux[0]);
		$("#searchTips").show();
		similarArtworks(aux[1], aux[0], aux[2]); 
	});
	
	//******************************SIMILAR SEARCH FIELD (max tips: 3)*********************
	$("#similarSearch1").click(function()
	{
		$("#searchTips").hide();
		var auxText = $("#similarSearch1").text();
		refreshTable(auxText);
		$("#txtSearch").val(auxText);
	});
	
	$("#similarSearch2").click(function()
	{
		$("#searchTips").hide();
		var auxText = $("#similarSearch2").text();
		refreshTable(auxText);
		$("#txtSearch").val(auxText);
	});
	
	$("#similarSearch3").click(function()
	{
		$("#searchTips").hide();
		var auxText = $("#similarSearch3").text();
		refreshTable(auxText);
		$("#txtSearch").val(auxText);
	});
	
	//INSERT NEW ARTWORK DIALOG - error in insert fields...
	function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
	
	//INSERT NEW ARTWORK DIALOG - check insert fields lenght...
	 function checkLength( o, n, min, max ) {
		 console.log(n);
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "La lunghezza di: " + n + " deve essere compresa fra: " +
          min + " e " + max + "." );
        return false;
      } 
	  else
	  {
        return true;
      }
    }
	
	
	//INSERT NEW ARTWORK DIALOG - adding of the artwork
	function checkArtwork(tipo)
	{
		var valid = true;
		allFields.removeClass( "ui-state-error" );
			
		valid = valid && checkLength( title, "Titolo", 1, 40 );
		valid = valid && (cbAuthor.attr('value')!=-1);
		valid = valid && checkLength( pictureAbstract, "Descrizione", 1, 150 );
		valid = valid && checkLength( tecnique, "tecnica artistica", 1, 100 );
		valid = valid && checkLength( movimento, "movimento artistico", 1, 100 );
		valid = valid && checkLength( wiki, "url wikipedia", 1, 100 );
		valid = valid && checkLength( anno, "anno ", 1, 100 );
		valid = valid && checkLength( altezza, "altezza", 1, 100 );
		valid = valid && checkLength( larghezza, "larghezza", 1, 100 ); 
		valid = valid && (cbLocation.attr('value')!=-1);

	
			if(tipo=="add"){
				valid = valid && (imgPath.val().split('\\').pop()!="");
				valid = valid && (imgPath1.val().split('\\').pop()!="");
				valid = valid && (imgPath2.val().split('\\').pop()!="");
				if(valid){
				tryA();
				addArtwork(title.val(), cbAuthor.attr('value'), pictureAbstract.val(), imgPath.val().split('\\').pop(),0,cbLocation.attr('value'),tecnique.val(),anno.val(),movimento.val(),altezza.val(),larghezza.val(),wiki.val(),imgPath1.val().split('\\').pop(),imgPath2.val().split('\\').pop());	
				dialog.dialog( "close" );	
				}
			}
			else{
				if(valid){
				tryA();
				updateArtwork(title.val(), cbAuthor.attr('value'), pictureAbstract.val(), imgPath.val().split('\\').pop(),0,cbLocation.attr('value'),tecnique.val(),anno.val(),movimento.val(),altezza.val(),larghezza.val(),wiki.val(),imgPath1.val().split('\\').pop(),imgPath2.val().split('\\').pop());	
				dialog.dialog( "close" );	
				}
			}
					
		return valid;
	}
});


/*****
	FEEDBACK
*****/

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

				$("#after-feedback-content").show();
				$("#feedback-content").hide();
			}
			else
				alert("Mail non valida");		
	}
}

/***********
	END FEEDBACK
************/

//Creating a table row with dynamic buttons to delete or edit the artwork
function showArtwork(response, i)
{
	/*
	*	NEW
	*/
	var admin = response[i].type;

	if (i == 0 && admin)
	{
		var tabella=$("#tableLayoutHome-Artworks-Table");
		var righe = "<tr id=\"tableLayoutHome-Artworks-Table-firstRow\"></tr><tr id=\"tableLayoutHome-Artworks-Table-secondRow\"></tr>";
		tabella.append(righe);
		var riga=$("#tableLayoutHome-Artworks-Table-firstRow");
		var htmlCell = "<td id=tableLayoutHome-Artworks-Table-0></td>"
		htmlDiv = "<a class=\"waves-effect waves-light btn\" id=\"btnInsertArtwork\">+</a>"
		riga.append(htmlCell);
		$("#tableLayoutHome-Artworks-Table-0").append(htmlDiv);
		$("#tableLayoutHome-Artworks-Table-0").attr("onClick","openDialogInsert()");
	
	}
	if (i == 0 && !admin)
	{
		var tabella=$("#tableLayoutHome-Artworks-Table");
		var righe = "<tr id=\"tableLayoutHome-Artworks-Table-firstRow\"></tr><tr id=\"tableLayoutHome-Artworks-Table-secondRow\"></tr>";
		tabella.append(righe);
	}
	i++;

	var tabella=$("#tableLayoutHome-Artworks-Table");
	var riga;
	//prima o seconda riga?
	if ( (i-1) % 2==0)
		riga=$("#tableLayoutHome-Artworks-Table-firstRow");
	else
		riga=$("#tableLayoutHome-Artworks-Table-secondRow");

	//recupero informazioni utili
	var id = response[i-1].id;
	var title = response[i-1].title;
	var height = response[i-1].dimensionHeight;
	var width = response[i-1].dimensionWidth;
	var pictureUrl = response[i-1].pictureUrl;

	
	var htmlCell; var htmlDiv;
	htmlCell = "<td id=\"tableLayoutHome-Artworks-Table-"+i+"\"></td>";
	
	htmlCell = "<td id=\"tableLayoutHome-Artworks-Table-"+i+"\"></td>";
	if (height >= width) 
	htmlDiv = "<div class=\"card cardV\" id=\"tableLayoutHome-Artworks-Table-container"+i+"\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" id=\"tableLayoutHome-Artworks-Table-img"+i+"\"></div></div>";
	else
	htmlDiv = "<div class=\"card cardH\" id=\"tableLayoutHome-Artworks-Table-container"+i+"\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" id=\"tableLayoutHome-Artworks-Table-img"+i+"\"></div></div>";

	htmlDiv2 = "<div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">"+ title +"<i class=\"material-icons right\">close</i></span>";
	htmlDiv2 += "<br><br>";
	//btn
	htmlDiv2 += "<p><a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Artworks-Table-btnView"+i+"\"><img src=\"img/ico/view.png\"></a>";
	if (admin)
	{
		htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Artworks-Table-btnEdit"+i+"\"><img src=\"img/ico/edit.png\"></a>";
		htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Artworks-Table-btnDelete"+i+"\"><img src=\"img/ico/delete.png\"></a>";
	}

	htmlDiv2 += "</p></div>";

	riga.append(htmlCell);
	$("#tableLayoutHome-Artworks-Table-"+i+"").append(htmlDiv);
	$("#tableLayoutHome-Artworks-Table-container"+i+"").append(htmlDiv2);
	
	//immagine alla cella
	asignImage("#tableLayoutHome-Artworks-Table-img"+i, "img/immagini/"+pictureUrl, height, width);
	//listener ai bottoni
	$("#tableLayoutHome-Artworks-Table-btnView"+i).attr("onClick", "supportViewArtwork("+id+")");

	if (admin)
	{
		$("#tableLayoutHome-Artworks-Table-btnDelete"+i).attr("onClick", "supportDeleteArtwork("+id+")");
		var btnMod = document.getElementById("tableLayoutHome-Artworks-Table-btnEdit"+i);
		btnMod.addEventListener('click',function()
		{
				$("#dialogInsertArtwork").dialog('open');
				$("#btnModifica").show();
				$("#btnInsert").hide();
				$("#txtTitle").val(response[i-1].title);
				$("#txtAbstract").val(response[i-1].abstract);		
				$( "#txtTecnique" ).val(response[i-1].tecnique);
				$( "#txtMovimento" ).val(response[i-1].artMovement);
				$( "#txtWiki" ).val(response[i-1].wikipediaPageArtwork);
				$( "#txtAnno" ).val(response[i-1].year);
				$( "#txtAltezza" ).val(response[i-1].dimensionHeight);
				$( "#txtLarghezza" ).val(response[i-1].dimensionWidth);
				//$("#showImg").attr('src','img/immagini/'+response[i-1].pictureUrl);		
				asignImage("#showImg", "img/immagini/"+response[i-1].pictureUrl, height, width);
				asignImage("#showImg1", "img/parallax/"+response[i-1].pictureUrl2, 400, 600);
				asignImage("#showImg2", "img/parallax/"+response[i-1].pictureUrl3, 400, 600);
				//$("#showImg1").attr('src','img/parallax/'+response[i-1].pictureUrl2);
				//$("#showImg2").attr('src','img/parallax/'+response[i-1].pictureUrl3);
				$("#cbAuthor").attr('value',response[i-1].author);
				$("#cbAuthor").text(response[i-1].name);
				$("#cbLocation").attr('value',response[i-1].idLocationsArtworks);
				$("#cbLocation").text(response[i-1].city);
				jqShowArtworks();
		});
	}

}

//Creating a table row with dynamic buttons to delete or edit the artwork
function showLocation(response, i)
{
	/*
	*	NEW
	*/
	if (i == 0)
	{
		var tabella=$("#tableLayoutHome-Locations-Table");
		var righe = "<tr id=\"tableLayoutHome-Locations-Table-firstRow\"></tr><tr id=\"tableLayoutHome-Locations-Table-secondRow\"></tr>";
		tabella.append(righe);
	}

	var tabella=$("#tableLayoutHome-Locations-Table");
	var riga;
	//prima o seconda riga?
	if ( (i) % 2==0)
		riga=$("#tableLayoutHome-Locations-Table-firstRow");
	else
		riga=$("#tableLayoutHome-Locations-Table-secondRow");

	//recupero informazioni utili
	var id = response[i].id;
	var locationName = response[i].name;
	var pictureUrl = response[i].pictureUrl;

	var htmlCell; var htmlDiv;
	htmlCell = "<td id=\"tableLayoutHome-Locations-Table-"+i+"\"></td>";
	htmlCell = "<td id=\"tableLayoutHome-Locations-Table-"+i+"\"></td>";
	htmlDiv = "<div class=\"card cardH\" id=\"tableLayoutHome-Locations-Table-container"+i+"\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" id=\"tableLayoutHome-Locations-Table-img"+i+"\"></div></div>";

	htmlDiv2 = "<div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">"+ locationName +"<i class=\"material-icons right\">close</i></span>";
	htmlDiv2 += "<br><br>";
	//btn
	htmlDiv2 += "<p><a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Locations-Table-btnView"+i+"\"><img src=\"img/ico/view.png\"></a>";
	//htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Locations-Table-btnEdit"+i+"\"><img src=\"img/ico/edit.png\"></a>";
	//htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Locations-Table-btnDelete"+i+"\"><img src=\"img/ico/delete.png\"></a></p>";
	htmlDiv2 += "</div>";

	riga.append(htmlCell);
	$("#tableLayoutHome-Locations-Table-"+i+"").append(htmlDiv);
	$("#tableLayoutHome-Locations-Table-container"+i+"").append(htmlDiv2);
	
	//immagine alla cella
	asignImage("#tableLayoutHome-Locations-Table-img"+i, "img/parallax/"+pictureUrl, 400, 600);
	//listener ai bottoni
	$("#tableLayoutHome-Locations-Table-btnView"+i).attr("onClick", "supportViewLocation("+id+")");
}

function showAuthor(response, i)
{
	/*
	*	NEW
	*/
	if (i == 0)
	{
		var tabella=$("#tableLayoutHome-Authors-Table");
		var righe = "<tr id=\"tableLayoutHome-Authors-Table-firstRow\"></tr><tr id=\"tableLayoutHome-Authors-Table-secondRow\"></tr>";
		tabella.append(righe);
	}

	var tabella=$("#tableLayoutHome-Authors-Table");
	var riga;
	//prima o seconda riga?
	if ( (i) % 2==0)
		riga=$("#tableLayoutHome-Authors-Table-firstRow");
	else
		riga=$("#tableLayoutHome-Authors-Table-secondRow");

	//recupero informazioni utili
	var id = response[i].id;
	var name = response[i].name;
	var pictureUrl = response[i].pictureUrlAuthor;

	var htmlCell; var htmlDiv;
	htmlCell = "<td id=\"tableLayoutHome-Authors-Table-"+i+"\"></td>";
	htmlCell = "<td id=\"tableLayoutHome-Authors-Table-"+i+"\"></td>";
	htmlDiv = "<div class=\"card cardV\" id=\"tableLayoutHome-Authors-Table-container"+i+"\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" id=\"tableLayoutHome-Authors-Table-img"+i+"\"></div></div>";

	htmlDiv2 = "<div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">"+ name +"<i class=\"material-icons right\">close</i></span>";
	htmlDiv2 += "<br><br>";
	//btn
	htmlDiv2 += "<p><a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Authors-Table-btnView"+i+"\"><img src=\"img/ico/view.png\"></a>";
	//htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Locations-Table-btnEdit"+i+"\"><img src=\"img/ico/edit.png\"></a>";
	//htmlDiv2 += "<a class=\"btn-floating btn-large waves-effect waves-light\" id=\"tableLayoutHome-Locations-Table-btnDelete"+i+"\"><img src=\"img/ico/delete.png\"></a></p>";
	htmlDiv2 += "</div>";

	riga.append(htmlCell);
	$("#tableLayoutHome-Authors-Table-"+i+"").append(htmlDiv);
	$("#tableLayoutHome-Authors-Table-container"+i+"").append(htmlDiv2);
	
	//immagine alla cella
	asignImage("#tableLayoutHome-Authors-Table-img"+i, "img/immagini/autori/"+pictureUrl, 600, 400);
	//listener ai bottoni
	console.log(id);
	$("#tableLayoutHome-Authors-Table-btnView"+i).attr("onClick", "supportViewAuthor("+id+")");
}

/*
*	Support btnArtwork
*/
function supportViewArtwork(id)
{
	post('/artworkDetails', { codice: id });
}

function supportViewAuthor(id)
{
	post('/authorDetails', { codice: id });
}

function supportViewLocation(id)
{
	post('/locationDetails', { codice: id });
}

function supportDeleteArtwork(id)
{
	deleteArtwork(id); 
	jqShowArtworks();
}

//INSERT NEW DIALOG button handler (open the dialog)
function openDialogInsert()
{
	console.log("ok");
	cleanDialogFields();
	$("#dialogInsertArtwork").dialog('open');
	$("#btnModifica").hide();
	$("#btnInsert").show();
}


//SHOW SIMILAR RESEARCH field (max 3) after a research (related researchs)
function showSimilar(response, i)
{
	if (i!=-1)
		var title = response[i].title;
	$("#noTip").hide();
	switch (i)
	{
		case 0:
			$("#similarSearch1").text(title);
		break;
		case 1:
			$("#similarSearch2").text(title);
		break;
		case 2:
			$("#similarSearch3").text(title);
		break;
	}
	if (i == -1)
		$("#noTip").show();
		
}


/************
*END SINGLE PAGE ARTWORK
************/

/*******************************************************************
* auxiliary functions to connect to the server and cleaning function
*********************************************************************/

//empty the artworks table
function cleanTable()
{
	$( "#tableLayoutHome-Artworks-Table").empty();
	//$( "#tableLayoutHome-Locations-Table").empty();
}

function cleanTableLocations()
{
	$( "#tableLayoutHome-Locations-Table").empty();
}

function cleanTableAuthors()
{
	$( "#tableLayoutHome-Authors-Table").empty();
}

//show all artworks
function jqShowArtworks()
{
	showArtworks();
}

function jqShowLocations()
{
	showLocations();
}

function jqShowAuthors()
{
	showAuthors();
}


//gestione combobox 
function cbAuthors(authors){
		$("#dropdown1").empty();
		console.log("entrooooo");
		var i=0;
		for(i=0;i<authors.length;i++){
			$("#dropdown1").append('<li><a id="hrefA'+i+'" href="#!" value="'+authors[i].id+'">'+authors[i].name+'</a></li>');
			$( "#hrefA"+i ).click(function(event){
				$("#cbAuthor").text( event.target.text );
				console.log($(this).attr('value'));
				$("#cbAuthor").attr('value',$(this).attr('value'));
				});
		}
	}
function cbLocations(locations){	
		$("#dropdownLocation").empty();
		var i=0;
		for(i=0;i<locations.length;i++){
			$("#dropdownLocation").append('<li><a id="hrefL'+i+'" href="#!" value="'+locations[i].id+'">'+locations[i].name+'</a></li>');
			$( "#hrefL"+i ).click(function(event){
				$("#cbLocation").text( event.target.text );
				console.log($(this).attr('value'));
				$("#cbLocation").attr('value',$(this).attr('value'));
				});
		}
	}

//refresh the table after a research - db reading operation
function refreshTable(partial)
{
	searchArtworks(partial);
}

function refreshTableAuthors(author)
{
	console.log("okokok");
	searchAuthors(author);
}

function refreshTableLocations(location)
{
	console.log("okokok");
	searchLocations(location);
}

//show a single artwork in a new page
function showSingle(id)
{
	showSingleArtworkInfo(id);
}

//clean the field of similar search
function cleanSimilar()
{
	$("#similarSearch1").text("");
	$("#similarSearch2").text("");
	$("#similarSearch3").text("");
}

function cleanDialogFields()
{
	$("#txtTitle").val("");
	$("#txtAuthor").val("")
	$("#txtAbstract").val("");	
	$("#showImg").attr('src', "");
	$("#userPhotoInput").val("");
	$("#showImg1").attr('src', "");
	$("#pictureUrl1").val("");
	$("#showImg2").attr('src', "");
	$("#pictureUrl2").val("");
	$( "#txtTecnique" ).val("");
	$( "#txtMovimento" ).val("");
	$( "#txtWiki" ).val("");
	$( "#txtAnno" ).val("");
	$( "#txtAltezza" ).val("");
	$( "#txtLarghezza" ).val("");
	$("#cbAuthor").attr('value',-1);
	$("#cbLocation").attr('value',-1);
	$("#cbAuthor").text("Museo");
	$("#cbLocation").text("Autore");
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
		nHeight = 200; nWidth = 300;
	}
	$(id).attr("src", pic);
	$(id).attr("width", nWidth+"px");
	$(id).attr("height", nHeight+"px");
}

/**************************END*********************/

