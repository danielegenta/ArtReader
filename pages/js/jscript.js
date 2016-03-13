/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/


$(document).ready(function()
{	
	//definizione campi e var per inserimento nuova opera
	var dialog, form,
      title = $( "#txtTitle" ),
      author = $( "#txtAuthor" ),
      pictureAbstract = $( "#txtAbstract" ),
	  pictureUrl = $( "#txtPictureUrl" ),
      allFields = $( [] ).add( title ).add( author ).add( pictureAbstract ).add( pictureUrl),
	  tips = $( ".validateTips" );
	  
	jqShowArtworks();
	$("#searchTips").hide();
	
	//dialog per inserimento nuova opera
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

	//Btn per apertura della dialog
	$("#btnInsertArtwork").click(function() {
		cleanDialogFields();
		
		
		$("#dialogInsertArtwork").dialog('open');
		$("#btnModifica").hide();
		$("#btnInsert").show();
		
	});
	
	//ricerca
	$("txtSearch").focus(function() { $(this).select(); } );
	 $("input:text").click(function() { $(this).select(); } );
	$( "#txtSearch" ).keyup(function() {
		cleanTable();
		var stringSearch = $("#txtSearch").val();
		refreshTable(stringSearch);
		
		ricerca();
	});
	//ritorna allo stato originale
	$("#txtSearch").focusout(function()
	{
		if ($(this).val() == "" )
		{
			$(this).val("Ricerca un'opera d'arte..."); 
			$("#searchTips").hide();
		}
			
		
	});

	$("#lstSuggerimenti").change(function(){
		selVal = $( "#lstSuggerimenti option:selected" ).text();
		
		//aux = title
		var aux = selVal.split(" - ");
		$("#txtSearch").val(aux[0]);
		$("#lstSuggerimenti").css("display", "none")
		refreshTable(aux[0]);
		
		$("#searchTips").show();
		
		//aux = author
		similarArtworks(aux[1], aux[0]); 
	});
	
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
	
	//showing single artwork info
	$("#tableArtworks").delegate('tr td:nth-child(2)', 'click', function() {
		//retrieve id
        
		
		var id = $(this).closest('tr').find('td:first').text();
		
		event.preventDefault(); // Stops browser from navigating away from page
        var data;
        // build a json object or do something with the form, store in data
        $.post('/artworkDetails', data, function(resp) {
            $('body').html(resp);
			//$("*").replaceWith(resp);
            // do something when it was successful
			showSingle(id);
        });


		
    });
	
	
	
	//Se sbaglio in inserimento
	function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
	
	//Controlla lunghezza dei campi che sto aggiungendo
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
	
	
	//Inserisce artworK 
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

//creating a table row with dynamic buttons to delete or edit the artwork
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
				   
	var pictureabstract=$("<td></td>");
	pictureabstract.text(response[i].pictureAbstract);
	riga.append(pictureabstract);
	
	var tdbutt=$("<td></td>");
	var butDel=document.createElement("button");
	//var t=document.createTextNode("delete");
	butDel.addEventListener('click',function(){deleteArtwork(response[i].id); jqShowArtworks();});
	var att = document.createAttribute("class");       // Create a "class" attribute
	att.value = "btn-floating btn-large waves-effect waves-light";                           // Set the value of the class attribute
	butDel.setAttributeNode(att);
	att = document.createAttribute("style");   
	att.value = "background-image:url('img/ico/delete.png'); background-repeat:no-repeat";   
	butDel.setAttributeNode(att);
	//butDel.appendChild(t);
	tdbutt.append(butDel);
	var butMod=document.createElement("button");
	//t=document.createTextNode("Update");
	butMod.name="mod";
	//butMod.appendChild(t);
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

//show similar search field (max 3) after a research
function showSimilar(response, i)
{
	if (i!=-1)
		var title = response[i].title;
	cleanSimilar();
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

function printArtworkDetails(artwork)
{
	$("#lblTitle, #infoHeader").text(artwork.title);
}

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

