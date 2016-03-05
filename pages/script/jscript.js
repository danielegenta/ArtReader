$(document).ready(function()
{
	//////////////////---lascia---
	$.noConflict(true);
	///////////////////
	
	var dialog, form,
      title = $( "#txtTitle" ),
      author = $( "#txtAuthor" ),
      pictureAbstract = $( "#txtAbstract" ),
	  pictureUrl = $( "#txtPictureUrl" ),
      allFields = $( [] ).add( title ).add( author ).add( pictureAbstract ).add( pictureUrl),
	  tips = $( ".validateTips" );
	  
	  
	dialog = $( "#dialogInsertArtwork" ).dialog({
		 autoOpen: false,
		  height: 500,
		  width: 600,
		  modal: true,
		  buttons: {
			"Inserisci": inserArtwork,
			Cancel: function() {
			  dialog.dialog( "close" );
			}
		  },
		  close: function() {
			form[ 0 ].reset();
			allFields.removeClass( "ui-state-error" );
		  }
	});

	$("#btnInsertArtwork").click(function() {
		$("#dialogInsertArtwork").dialog('open');
	});
	
	 form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      inserArtwork();
    });
	
	function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
	
	 function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }
	
	function inserArtwork()
	{
	  var valid = true;
      allFields.removeClass( "ui-state-error" );
 
      valid = valid && checkLength( title, "Titolo", 1, 40 );
      valid = valid && checkLength( author, "Autore", 2, 40 );
      valid = valid && checkLength( pictureAbstract, "Descrizione", 1, 150 );
	  valid = valid && checkLength( pictureUrl, "Url Immagine", 8, 100 );
 
	  //da modificare
	  /*
      valid = valid && checkRegexp( title, /^[a-z]([0-9a-z_\s])+$/i, "Title may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
	  
	  //ok
      valid = valid && checkRegexp( author, /^[a-z]([0-9a-z_\s])+$/i, "Autore may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
      valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );*/
 
      if ( valid ) {
        $( "#listArtworks tbody" ).append( "<tr>" +
          "<td>" + title.val() + "</td>" +
          "<td>" + author.val() + "</td>" +
          "<td>" + pictureUrl.val() + "</td>" +
		   "<td>" + pictureAbstract.val() + "</td>" +
        "</tr>" );
        dialog.dialog( "close" );
	}
	return valid;
	}
});



