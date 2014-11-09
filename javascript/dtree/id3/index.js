(function() {

	var grafo = new id3.Grafo("#viewport");

	$("#processar").click( function() {
		$("#valor-entropia").val("");
		var dadosTexto = $("#dados").val();

		var dados = new id3.Dados();
		dados.carregarTexto(dadosTexto);

		var algoritmoID3 = new id3.ID3(dados);
		algoritmoID3.executar();

		grafo.renderizar(algoritmoID3);
	});

	$("#exemplo").change(function(e){
		var d = $(this).val();

		if (d != ""){
			var dados = id3.exemplos[d];
			//console.log(dados);
			$("#dados").val(dados);
		}
	});

})();
function mostarEntropia(valor) {
	$("#valor-entropia").val($("#valor-entropia").val()+valor+"\n");
}

var leitorDeCSV = new FileReader();

window.onload = function init() {
	leitorDeCSV.onload = leCSV;
}

function pegaCSV(inputFile) {
	var file = inputFile.files[0];
 	leitorDeCSV.readAsText(file);
}

function leCSV(evt) {
	var fileArr = evt.target.result;
	$("#dados").val(fileArr);
}