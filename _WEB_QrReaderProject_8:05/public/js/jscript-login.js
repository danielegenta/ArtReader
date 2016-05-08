/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	
	//LOGIN WINDOW - SHOW PASSWORD CHECKBOX
	$("#chkShowPassword").change(function() 
	{
		if(this.checked)
			$("#password").attr("type", "text")
		else
			$("#password").attr("type", "password")
	});

});