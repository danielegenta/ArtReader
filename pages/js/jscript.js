/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	
	//INSERT NEW ARTWORK var and fields
	var dialog, form,
      title = $( "#txtTitle" ),
      author = $( "#txtAuthor" ),
      pictureAbstract = $( "#txtAbstract" ),
	  pictureUrl = $( "#txtPictureUrl" ),
      allFields = $( [] ).add( title ).add( author ).add( pictureAbstract ).add( pictureUrl),
	  tips = $( ".validateTips" );
	  
	//first loading of the artworks table
	jqShowArtworks();
	$("#searchTips").hide();
	//INSERT NEW ARTWORK dialog
	dialog = $( "#dialogInsertArtwork" ).dialog({
		 autoOpen: false,
		  height: 500,
		  width: 600,
		  modal: true,
		  buttons: {
			  "Modifica": 
			{
				id: "btnModifica",
				text: "Modifica",
				click:function(){
					
					updateArtwork($("#txtTitle").val(),$("#txtAuthor").val(),$("#txtAbstract").val(),$("#txtPictureUrl").val());
					dialog.dialog( "close" );
				}		
			},			
			"Inserisci": 
			{
				id: "btnInsert",
				text: "Inserisci",
				click:function(){
				checkArtwork();
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
	function checkArtwork()
	{
		
		var valid = true;
		allFields.removeClass( "ui-state-error" );

		valid = valid && checkLength( title, "Titolo", 1, 40 );
		valid = valid && checkLength( author, "Autore", 2, 40 );
		valid = valid && checkLength( pictureAbstract, "Descrizione", 1, 150 );
		valid = valid && checkLength( pictureUrl, "Url Immagine", 8, 100 );
	  //da modificare REGEX INSERIMENTO NUOVA OPERA
	  /*
      valid = valid && checkRegexp( title, /^[a-z]([0-9a-z_\s])+$/i, "Title may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
	  
	  //ok
      valid = valid && checkRegexp( author, /^[a-z]([0-9a-z_\s])+$/i, "Autore may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
      valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );*/
		if ( valid )
		{
			//rileggo il db
			dialog.dialog( "close" );
			addArtwork(title.val(), author.val(), pictureAbstract.val(), pictureUrl.val());	
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
	author.text(response[i].author);
	riga.append(author);
				   
	var pictureurl=$("<td></td>");
	pictureurl.text(response[i].pictureUrl);
	riga.append(pictureurl);
				   
	//descrizione troppo lunga, sostituire!
	var pictureabstract=$("<td></td>");
	pictureabstract.text("placeholder"); //response[i].pictureAbstract);
	riga.append(pictureabstract);
	
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
		$("#txtAuthor").val(response[i].author);
		$("#txtPictureUrl").val(response[i].pictureUrl);
		$("#txtAbstract").val(response[i].pictureAbstract);		

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
	$("#lblTitle, #infoHeader").text(artwork.title);
	$("#lblAuthor").text(artwork.author);
	$("#lblTecnique").text(artwork.tecnique);
	var tmp = artwork.dimensionWidth + "x" + artwork.dimensionHeight + " (cm)";
	$("#lblDimensions").text(tmp);
	$("#lblWikipediaPageArtwork").attr("href", artwork.wikipediaPageArtwork);
	
	//$("#lblLocation").text(tmp);
	$("#lblYear").text(artwork.year);
	$("#lblArtMovement").text(artwork.artMovement);
	$("#lblArtworkAbstract").text(artwork.abstract);
	
	$("#imgArtwork").attr("src", artwork.pictureUrl);
	
	//parallax
	$("#parallaxTop").attr("src", "img/parallax/"+artwork.pictureUrl2+".jpg");
	$("#parallaxBottom").attr("src", "img/parallax/"+artwork.pictureUrl3+".jpg");
	
	//related artworks
	relatedArtworks_SinglePageArtwork(artwork.author, artwork.title, artwork.artMovement);
}

//PRINT RELATED ARTWORKS in singleArtwork.html
function showRelated_SinglePageArtwork(response, i)
{
	var id = response[i].id;
	var title = response[i].title;
	var pic = response[i].pictureUrl;
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
		$("#txtPictureUrl").val("")
		$("#txtAbstract").val("");
}

/**************************END*********************/

