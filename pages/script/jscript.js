/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/


$(document).ready(function()
{
	//////////////////---lascia---
	//$.noConflict(true);
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
			"Chiudi": function() {
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
	
	function cleanDialogFields()
	{
		$("#txtTitle").val("");
		$("#txtAuthor").val("")
		$("#txtPictureUrl").val("")
		$("#txtAbstract").val("");
	}
	
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

function showArtwork(response, i)
	{
		var tabella=$("#tableArtworks");
        var riga=$("<tr></tr>");
                       
        var id=$("<td></td>");
        id.text(response[i].id);
        riga.append(id);
		
		var title=$("<td></td>");
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
		var t=document.createTextNode("delete");
		butDel.addEventListener('click',function(){deleteArtwork(response[i].id); jqShowArtworks();});
		butDel.appendChild(t);
		tdbutt.append(butDel);
		
		var butMod=document.createElement("button");
		t=document.createTextNode("Update");
		butMod.name="mod";
		butMod.appendChild(t);
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
	
function cleanTable()
{
	$( "#mainTable").empty();
}

function jqShowArtworks()
{
	showArtworks();
}


