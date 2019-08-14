const states = [];
let citys = [];

$(document).ready(function(){

    $('#telefone').mask('(99) 99999-9999')

    getStatesApi()

    $('#estado').blur(function(e){
        if(this.value != undefined && this.value != '' && this.value != null){
            if(this.value in states){
                getCitysApi(states[this.value].id)
            }else{
                swal("Opa",`O campo de estado deve ser preenchido com a UF. Exemplo: ${getStringsUf()}`, 'error')
            }
        }
    })

    $('#cidade').blur(function(e){
        if(!citys.includes(this.value) && this.value != undefined && this.value != '' && this.value != null){
            swal('Ops','Essa cidade não pertence a esse estado','error')
        }
    })

    $('#formulario-contato').submit(function(e){
        e.preventDefault();

        let urlPost = 'https://formspree.io/pokemongo.vet.br@gmail.com';
        let city = $('#cidade').val();
        let state = $('#estado').val();
        let phone = $('#telefone').val();
        let errors = []

        phone = phone.replace('(','')
        phone = phone.replace('-','')
        phone = phone.replace(')','')
        phone = phone.replace(' ','')

        getCitysApi(states[state].id)

        if(city == undefined || city == '' || city == null) errors.push('O campo cidade não pode ser vazio')
        if(state == undefined || state == '' || state == null) errors.push('O campo estado não pode ser vazio')
        if(!(state in states))   errors.push(`O campo de estado deve ser preenchido com a UF. Exemplo: $getStringsUf()}`)
        if(!citys.includes(city))   errors.push(`Essa cidade não pertence a esse estado`)
        if(!$.isNumeric(phone) || phone.length > 16 || phone.length < 10) errors.push('Ops, o formato do telefone deve ser: (99) 99999-9999')

        if(errors.length != 0){
            swal('Ops', errors.join('.'), 'error')
        }else{
            let form = document.getElementById('formulario-contato')
            let fd = new FormData(form)

            $.ajax({
                url: urlPost,
                method: 'POST',
                data: fd,
                processData: false,
                contentType: false,
                success: function(serverResponse){
                    swal('Boa!','Obrigado pela sua indicação!','success')
                }
            })
        }
    })

})

const getCitysApi = (uf) => {
    $.ajax({
		url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
		method: 'GET',
		dataType: 'json',
		success: function(citysApi){
            citys = []
            
            for(i in citysApi){
                citys.push(citysApi[i].nome)
            }
		}
	});
}

const getStatesApi = () => {
    $.ajax({
		url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`,
		method: 'GET',
		dataType: 'json',
		success: function(statesApi){
			for(i in statesApi){
                states[statesApi[i].sigla] = { 
                    name: statesApi[i].nome,
                    id: statesApi[i].id
                }
            }
		}
	});
}

const getStringsUf = () => {
    let arrayUf = [];

    for(i in states)
        arrayUf.push(i)

    return arrayUf.join(',')
}

