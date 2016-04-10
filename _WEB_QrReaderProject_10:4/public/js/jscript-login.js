/************************************************
*************Funzioni jQuery/jQuery-UI***********
*************************************************/

$(document).ready(function()
{	
	//LOGIN WINDOW - SHOW PASSWORD CHECKBOX
	$("#chkShowPassword").change(function() {
	//alert("ok");
    if(this.checked)
        $("#password").attr("type", "text")
	else
		$("#password").attr("type", "password")
	});

});