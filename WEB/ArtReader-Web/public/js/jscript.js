/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	
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
	
	$("#searchTips").hide();
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

	//INSERT NEW DIALOG button handler (open the dialog)
	$("#btnInsertArtwork").click(function() {
		cleanDialogFields();
		$("#dialogInsertArtwork").dialog('open');
		$("#btnModifica").hide();
		$("#btnInsert").show();
		
	});
	
	//RESERACH 
	$("txtSearch").focus(function() { $(this).select(); } );
	 $("input:text").click(function() { $(this).select(); } );
	//called when i type on txtSearch
	$( "#txtSearch" ).keyup(function() {
		cleanTable();
		var stringSearch = $("#txtSearch").val();
		refreshTable(stringSearch);
		ricerca();
	});
	//RESTORE INITIAL STATUS of txtSearch
	$("#txtSearch").focusout(function()
	{
		if ($(this).val() == "" )
		{
			$(this).val("Ricerca un'opera d'arte..."); 
			$("#searchTips").hide();
		}
			
		
	});

	//GOOGLE ISTANT tips
	$("#lstSuggerimenti").change(function(){
		selVal = $( "#lstSuggerimenti option:selected" ).text();
		//aux: title - author - artMovement
		var aux = selVal.split(" - ");
		$("#txtSearch").val(aux[0]);
		$("#lstSuggerimenti").css("display", "none")
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
	
	//showing single artwork info(click on title td)
	$("#tableArtworks").delegate('tr td:nth-child(2)', 'click', function() {
		//retrieve id
		var id = $(this).closest('tr').find('td:first').text();
		event.preventDefault(); // Stops browser from navigating away from page
        var data;
        $.post('/artworkDetails', data, function(resp) {
            $('body').html(resp);
			showSingle(id);
        });
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

//Creating a table row with dynamic buttons to delete or edit the artwork
function showArtwork(response, i)
{
	var tabella=$("#tableArtworks");
	var riga=$("<tr></tr>");
				   
	var id=$("<td></td>");
	id.text(response[i].id);
	riga.append(id);
	
	var title=$("<td class='cellTitle'></td>");
	title.text(response[i].title);
	riga.append(title);
	 
	var author=$("<td></td>");
	author.text(response[i].name);
	riga.append(author);
				   
	var pictureurl=$("<td></td>");
	var img = $('<img width="150" >'); 
	img.attr('src', 'img/immagini/'+response[i].pictureUrl);
	pictureurl.append(img);
	riga.append(pictureurl);
		
	//alert(response[i].description);
	var locationAbstract=$("<td></td>");
	locationAbstract.text(response[i].city);
	riga.append(locationAbstract);
	
	var tdbutt=$("<td></td>");
	var butDel=document.createElement("button");
	butDel.addEventListener('click',function(){deleteArtwork(response[i].id); jqShowArtworks();});
	var att = document.createAttribute("class");       // Create a "class" attribute
	att.value = "btn-floating btn-large waves-effect waves-light";                           // Set the value of the class attribute
	butDel.setAttributeNode(att);
	att = document.createAttribute("style");   
	att.value = "background-image:url('img/ico/delete.png'); background-repeat:no-repeat";   
	butDel.setAttributeNode(att);
	tdbutt.append(butDel);
	
	
	var butMod=document.createElement("button");
	butMod.name="mod";
	var att = document.createAttribute("class");       // Create a "class" attribute
	att.value = "btn-floating btn-large waves-effect waves-light";                           // Set the value of the class attribute
	butMod.setAttributeNode(att);
	att = document.createAttribute("style");   
	att.value = "background-image:url('img/ico/edit.png'); background-repeat:no-repeat";   
	butMod.setAttributeNode(att);
	butMod.addEventListener('click',function()
	{
		$("#dialogInsertArtwork").dialog('open');
		$("#btnModifica").show();
		$("#btnInsert").hide();
		
		$("#txtTitle").val(response[i].title);
		$("#txtAbstract").val(response[i].abstract);		
		$( "#txtTecnique" ).val(response[i].tecnique);
		$( "#txtMovimento" ).val(response[i].artMovement);
		$( "#txtWiki" ).val(response[i].wikipediaPageArtwork);
		$( "#txtAnno" ).val(response[i].year);
		$( "#txtAltezza" ).val(response[i].dimensionHeight);
		$( "#txtLarghezza" ).val(response[i].dimensionWidth);
		$("#showImg").attr('src','img/immagini/'+response[i].pictureUrl);		
		$("#showImg1").attr('src','img/parallax/'+response[i].pictureUrl2);
		$("#showImg2").attr('src','img/parallax/'+response[i].pictureUrl3);
		$("#cbAuthor").attr('value',response[i].author);
		$("#cbAuthor").text(response[i].name);
		$("#cbLocation").attr('value',response[i].idLocationsArtworks);
		$("#cbLocation").text(response[i].city);
		jqShowArtworks();
	});
	tdbutt.append(butMod);
	
	riga.append(tdbutt);				  
	tabella.append(riga);
}

//SHOW SIMILAR RESEARCH field (max 3) after a research (related researchs)
function showSimilar(response, i)
{
	if (i!=-1)
		var title = response[i].title;
	$("#noTip").html("");
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
		$("#noTip").text("Nessuna ricerca correlata al quadro ricercato");
		
}
/******************************************************
*		SINGLE PAGE ARTWORK.HTML
*******************************************************/
//PRINT SINGLE ARTWORK DETAIL in singleArtwork.html
function printArtworkDetails(artwork)
{
	//map
	$("#lblAddress").text(artwork.address);
	if ($("#lblTitle").text() != "")
	{
		mia_posizione(artwork.address);
	}
	$("#lblTitle, #infoHeader").text(artwork.title);
	
	$("#lblAuthor-link").text(artwork.name +", "+artwork.nationalityAuthor);
	$("#lblAuthor-link").attr("href", artwork.wikipediaPageAuthor);
	
	
	$("#lblTecnique").text(artwork.tecnique);
	var tmp = artwork.dimensionWidth + "x" + artwork.dimensionHeight + " (cm)";
	$("#lblDimensions").text(tmp);
	$("#lblWikipediaPageArtwork").attr("href", artwork.wikipediaPageArtwork);
	
	$("#lblLocation-link").text(artwork.description + ", "+ artwork.city + ", "+artwork.nation);
	$("#lblLocation-link").attr("href", artwork.wikipediaPageLocation);
	
	$("#lblYear").text(artwork.year);
	$("#lblArtMovement").text(artwork.artMovement);
	$("#lblArtworkAbstract").text(artwork.abstract);
	
	$("#imgArtwork").attr("src", "img/immagini/"+artwork.pictureUrl);
	
	//parallax
	$("#parallaxTop").attr("src", "img/parallax/"+artwork.pictureUrl2);
	$("#parallaxBottom").attr("src", "img/parallax/"+artwork.pictureUrl3);
	

	
	//related artworks
	relatedArtworks_SinglePageArtwork(artwork.author, artwork.title, artwork.artMovement);
}



//PRINT RELATED ARTWORKS in singleArtwork.html
function showRelated_SinglePageArtwork(response, i)
{
	var id = response[i].id;
	var title = response[i].title;
	var pic = 'img/immagini/'+response[i].pictureUrl;
	var width = response[i].dimensionWidth;
	var height = response[i].dimensionHeight;
	switch (i)
	{
		case 0:
			asignImage("#imgSimilarResearch1", pic, height, width);
			$("#imgSimilarResearch1_caption").text(title);
			$("#imgSimilarResearch1, #imgSimilarResearch1_caption").attr("onClick", "showSingle("+id+")");
		break;
		case 1:
			asignImage("#imgSimilarResearch2", pic, height, width);
			$("#imgSimilarResearch2_caption").text(title);
			$("#imgSimilarResearch2, #imgSimilarResearch2_caption").attr("onClick", "showSingle("+id+")");
		break;
		case 2:
			asignImage("#imgSimilarResearch3", pic, height, width);
			$("#imgSimilarResearch3_caption").text(title);
			$("#imgSimilarResearch3, #imgSimilarResearch3_caption").attr("onClick", "showSingle("+id+")");
		break;
	}
}

//RELATED ARTWORKS dimension optimization
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

/************
*END SINGLE PAGE ARTWORK
************/

/*******************************************************************
* auxiliary functions to connect to the server and cleaning function
*********************************************************************/

//empty the artworks table
function cleanTable()
{
	$( "#mainTable").empty();
}

//show all artworks
function jqShowArtworks()
{
	console.log("ok");
	showArtworks();
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

/**************************END*********************/

