
/******************************************************
*		SINGLE PAGE AUTHOR.HTML
*******************************************************/
//PRINT SINGLE AUTHOR DETAIL in singleAuthor.html
$(document).ready(function()
{
	showSingleAuthorInfo();
});

function printAuthorDetails(author)
{
	$("#lblAuthorName, #infoHeader").text(author.name);
	$("#lblAuthorDateBorn").text(author.dateBorn);
	$("#lblAuthorLocationBorn").text(author.locationBorn);
	$("#lblAuthorNationality").text(author.nationalityAuthor);
	$("#lblWikipediaPageAuthor").attr("href", author.wikipediaPageAuthor);
	$("#imgAuthor").attr("src", "img/immagini/autori/"+author.pictureUrlAuthor);

	//related artworks*/
	relatedAuthors_SinglePageAuthor(author.nationalityAuthor);

	authorArtworks(author.id);
}



//PRINT RELATED ARTWORKS in singleArtwork.html
function showRelated_SinglePageAuthor(response, i)
{
	var id = response[i].id;
	var name = response[i].name;
	var pic = 'img/immagini/autori/'+response[i].pictureUrlAuthor;
	if (i==0)
	{
		$("#txtNoSimilarResearch").hide();
	}
	switch (i)
	{
		case 0:
			asignImage("#imgSimilarResearch1", pic, 600, 400);
			$("#imgSimilarResearch1_caption").text(name);
			$("#imgSimilarResearch1, #imgSimilarResearch1_caption").attr("onClick", "post('/authorDetails', { codice: "+id+" })");
		break;
		case 1:
			asignImage("#imgSimilarResearch2", pic, 600, 400);
			$("#imgSimilarResearch2_caption").text(name);
			$("#imgSimilarResearch2, #imgSimilarResearch2_caption").attr("onClick", "post('/authorDetails', { codice: "+id+" })");
		break;
		case 2:
			asignImage("#imgSimilarResearch3", pic, 600, 400);
			$("#imgSimilarResearch3_caption").text(name);
			$("#imgSimilarResearch3, #imgSimilarResearch3_caption").attr("onClick", "post('/authorDetails', { codice: "+id+" })");
		break;
	}
}

function showAuthorArtworks(response, i)
{
	var id = response[i].id;
	var title = response[i].title;
	var pic = 'img/immagini/'+response[i].pictureUrl;
	var height = response[i].dimensionHeight;
	var width = response[i].dimensionWidth;
	console.log(height, width);
	if (i==0)
	{
		$("#txtNoAuthorArtworks").hide();
	}
	switch (i)
	{
		case 0:
			asignImage("#imgAuthorArtworks1", pic, height, width);
			$("#imgAuthorArtworks1_caption").text(title);
			$("#imgAuthorArtworks1, #imgAuthorArtworks1_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 1:
			asignImage("#imgAuthorArtworks2", pic, height, width);
			$("#imgAuthorArtworks2_caption").text(title);
			$("#imgAuthorArtworks2, #imgAuthorArtworks2_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
		case 2:
			asignImage("#imgAuthorArtworks3", pic, height, width);
			$("#imgAuthorArtworks3_caption").text(title);
			$("#imgAuthorArtworks3, #imgAuthorArtworks3_caption").attr("onClick", "post('/artworkDetails', { codice: "+id+" })");
		break;
	}
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
		nHeight = 200; nWidth = 250;
	}
	
	$(id).attr("src", pic);
	$(id).attr("width", nWidth+"px");
	$(id).attr("height", nHeight+"px");
}