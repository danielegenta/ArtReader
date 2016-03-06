/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/


$(document).ready(function()
{
	//////////////////---lascia---
	$.noConflict(true);
	///////////////////
	
	//definizione campi e var per inserimento nuova opera
	var dialog, form,
      title = $( "#txtTitle" ),
      author = $( "#txtAuthor" ),
      pictureAbstract = $( "#txtAbstract" ),
	  pictureUrl = $( "#txtPictureUrl" ),
      allFields = $( [] ).add( title ).add( author ).add( pictureAbstract ).add( pictureUrl),
	  tips = $( ".validateTips" );
	  
	//dialog per inserimento nuova opera
	dialog = $( "#dialogInsertArtwork" ).dialog({
		 autoOpen: false,
		  height: 500,
		  width: 600,
		  modal: true,
		  buttons: {
			"Inserisci": 
			{
				id: "btnInsert",
				text: "Inserisci",
				onClick: "addArtwork()"
				
			},			
			"Chiudi": function() {
			  dialog.dialog( "close" );
			}
		  },
		  close: function() {
			form[ 0 ].reset();
			allFields.removeClass( "ui-state-error" );
		  }
	});

	//Btn per apertura della dialog
	$("#btnInsertArtwork").click(function() {
		$("#dialogInsertArtwork").dialog('open');
		
	});
	
	//Btn inserisci dentro la dialog
	 form = dialog.find( "#formDeleteUpdate" ).on( "submit", function( event ) {
      event.preventDefault();
      checkArtwork();
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
	
	
	//Inserisce artworK (SOLO SU HTML-NON ANCORA SU DB!!!!!)
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
			var tmp = "'"+title.val()+"'"; 
			$( "#listArtworks tbody" ).append( "<tr>" +
			  "<td>" + title.val() + "</td>" +
			  "<td>" + author.val() + "</td>" +
			  "<td>" + pictureUrl.val() + "</td>" +
			  "<td>" + pictureAbstract.val() + "</td>" +
			
			  "<td><form action='\delArtwork' method='get' name='formDeleteUpdate'><input type='button' value='cancella' onClick='deleteArtwork('"+tmp+"')'/>" +
			  "<button type='button' name='updateArtwork' onClick='updateArtwork()'>Modifica</button> </form> </td>" +
			"</tr>" );

			dialog.dialog( "close" );
		}
		return valid;
	}
	
	
});

function showArtwork(response, i)
	{
		var tmp = "";
		$( "#listArtworks tbody" ).append( "<tr>" +
			  "<td>" + response[i].title + "</td>" +
			  "<td>" + response[i].author + "</td>" +
			  "<td>" + response[i].pictureUrl + "</td>" +
			  "<td>" + response[i].pictureAbstract + "</td>" +
			  "<td><form action='\delArtwork' method='get' name='formDeleteUpdate'><input type='button' value='cancella' onClick='deleteArtwork('"+tmp+"')'/>" +
			  "<button type='button' name='updateArtwork' onClick='updateArtwork()'>Modifica</button> </form> </td>" +
			"</tr>" );
	}



