
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
			$("#imgSimilarResearch1, #imgSimilarResearch1_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 1:
			asignImage("#imgSimilarResearch2", pic, height, width);
			$("#imgSimilarResearch2_caption").text(title);
			$("#imgSimilarResearch2, #imgSimilarResearch2_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 2:
			asignImage("#imgSimilarResearch3", pic, height, width);
			$("#imgSimilarResearch3_caption").text(title);
			$("#imgSimilarResearch3, #imgSimilarResearch3_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
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