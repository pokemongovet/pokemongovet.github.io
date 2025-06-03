/* original post: http://www.red-team-design.com/css3-pricing-table */

$(document).on('ready',function(){
	var choosenPackage = window.location.search.split('=')[1];

	if(typeof choosenPackage !== 'undefined'){
		$('.hide-tipopadrao').hide();
		if(choosenPackage === 'basico') {
			$('.show-basico').show();
		}

		if(choosenPackage == 'profissional') {
			$('.show-profissional').show();
		}

		if(choosenPackage == 'premium') {
			$('.show-premium').show();
		}

		if(choosenPackage == 'promocional') {
			$('.show-promocional').show();
		}
	}

});
