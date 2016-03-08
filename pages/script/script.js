var richiesta, richiesta2;

function access()
{
    document.formLogin.action = "/access";  
    document.formLogin.submit();
	
	//---
	alert("schiaccia show per visualizzare lista");
	
}

//modificato qui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function deleteArtwork(id)
{
	richiesta2 = new XMLHttpRequest();
	var cod =id ;
	var url="delArtwork?id="+encodeURIComponent(cod);
	richiesta2.open("GET", url, true);
	richiesta2.onreadystatechange = aggiorna2;
	richiesta2.send(null);
}

function addArtwork(tit,aut,abs,pic)
{
	richiesta2 = new XMLHttpRequest();
	var title =tit ;
	var author =aut ;
	var pictureAbstract =abs;
	console.log("!!!!! "+abs+" "+pictureAbstract);
	var pictureurl=pic;
	var url="insertArtwork?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&pictureAbstract="+encodeURIComponent(pictureAbstract)+"&pictureUrl="+encodeURIComponent(pictureurl);
	richiesta2.open("GET", url, true);
	richiesta2.onreadystatechange = aggiorna2;
	richiesta2.send(null);
	
}

function updateArtwork(tit,aut,abs,pic)
{
	richiesta2 = new XMLHttpRequest();
	var title =tit ;
	var author =aut ;
	var picAbstract =abs 
	var pictureurl=pic;
	var url="updArtwork?title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&pictureAbstract="+encodeURIComponent(picAbstract)+"&pictureUrl="+encodeURIComponent(pictureurl);
	richiesta2.open("GET", url, true);
	richiesta2.onreadystatechange = aggiorna2;
	richiesta2.send(null);
}

function aggiorna()
{
	if (richiesta.readyState == 4 && richiesta.status == 200)
	{
		var response = JSON.parse(richiesta.responseText);
		var artworks = response;
		console.log(response);
		var i = 0;
		cleanTable();
		for (var counter in artworks)
		{
			console.log("ok");
			showArtwork(artworks, i);
			i++;
		}
		
	}
}

function aggiorna2()
{
	if (richiesta2.readyState == 4 && richiesta2.status == 200)
	{
		var response = richiesta2.responseText;
		console.log(response);
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



