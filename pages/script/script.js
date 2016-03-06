var richiesta;

function access()
{
    document.formLogin.action = "/access";  
    document.formLogin.submit();
	
	//---ù
	alert("schiaccia show per visualizzare lista");
	
	
}

function deleteArtwork(title)
{
	console.log("ok");
	document.formDeleteUpdate.method = "get";
	document.formDeleteUpdate.action = "/delArtwork";
	document.formDeleteUpdate.submit();
}

function addArtwork()
{
	document.formAddUpdateArtwork.method = "get";
    document.formAddUpdateArtwork.submit();
}

function updateArtwork()
{
	document.listArtworks.action = "/updateArtwork";
	document.listArtworks.submit();
}

function aggiorna()
{
	if (richiesta.readyState == 4 && richiesta.status == 200)
	{
		var response = JSON.parse(richiesta.responseText);
		var artworks = response;
		console.log(response);
		var i = 0;
		for (var counter in artworks)
		{
			//SPOSTARE IN JSCRIPT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			console.log("ok");
			showArtwork(artworks, i);
			i++;
		}
		
	}
}

function showArtworks()
{
	richiesta = new XMLHttpRequest();
	var url="/allArtworks";
	richiesta.open("GET", url, true);
	richiesta.onreadystatechange = aggiorna;
	richiesta.send(null);
}



