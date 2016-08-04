/* original post: http://www.red-team-design.com/css3-pricing-table */

$(document).on('ready',function(){
	var choosenPackage = window.location.search.split('=')[1];

	if(typeof choosenPackage !== 'undefined'){
		if(choosenPackage !== 'basic') {
			$('.hide-basic').hide();
		}

		if(choosenPackage == 'profissional') {
			$('.show-profissional').show();
		}

		if(choosenPackage == 'bussiness') {
			$('.show-bussiness').show();
		}

		if(choosenPackage == 'promocional') {
			$('.show-promocional').show();
		}
	}

});
