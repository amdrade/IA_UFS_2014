var w0=0, w1=0;
var x = [2, 4, 6, 8, 9, 12, 1, 2, 15];
var y = [2, 5, 5, 8, 10,11, 2, 3, 13];
var	registros = [];
var	atributos = [];
var datasetTreino = [];
var datasetTeste = [];
function h(x) {
	return w0 + w1*x;
}
function dEdw1 () {
	var sum = 0;

	/*var lengthX = x.length;
	for (var i = 0; i < lengthX; i++) {
		sum += (h(x[i]) - y[i]) * x[i];
	}
	return 2 * sum / lengthX;*/

	var n = datasetTreino.length;
	for (var i = 0; i < n; i++) {
		sum += (h(datasetTreino[i][0]) - datasetTreino[i][1]) * datasetTreino[i][0];
	}
	return 2 * sum / n;
}
function dEdw0 () {
	/*var sum = 0, lengthX = x.length;
	for (var i = 0; i < lengthX; i++) {
		sum += (h(x[i]) - y[i]) * 1;
	}
	return 2 * sum / lengthX;*/

	var sum = 0, n = datasetTreino.length;
	for (var i = 0; i < n; i++) {
		sum += (h(datasetTreino[i][0]) - datasetTreino[i][1]) * 1;
	}
	return 2 * sum / n;
}
function MSE () {
	var sum = 0, n = datasetTreino.length;
	for (var i = 0; i < n; i++) {
		sum += (h(datasetTreino[i][0]) - datasetTreino[i][1]) * (h(datasetTreino[i][0]) - datasetTreino[i][1]);
	}
	return sum / n;

}
function treinar() {


	holdout();

	var alfa = 0.01;  // taxa de aprendizado
	var tolerancia = 1e-11;   // tolerancia para convergencia
	var maxiter = 9000;   // # max de iteracoes
	var intervalo = 1;   // intervalo para mostrar resultados durante iteracoes
	var delta0, delta1; //diferenca para atualizacao dos pesos
	var iters = 0;
	// pesos iniciais
	w0 = 0;
	w1 = 0;

	do {
		iters++;

		delta1 = alfa * dEdw1();
		delta0 = alfa * dEdw0();

		w1 = w1 - delta1;
		w0 = w0 - delta0;

		if (iters % intervalo == 0){
			console.log("Iteracao " + iters + " : w0 = " + w0 + " - " + delta0 + ", w1 = " + w1 + " - "+ delta1);
        	console.log("Erro na iteracao " + iters + " = " + MSE());
		}

		if (iters > maxiter) break;
	} while (Math.abs(delta1) > tolerancia || Math.abs(delta0) > tolerancia);

	$("#saida").text("Convergencia apos " + iters + " iteracoes: w0=" + w0 + ", w1=" + w1);

}

function testar(){
	for (var i = datasetTeste.length - 1; i >= 0; i--) {
		var predito = h(datasetTeste[i][0]);
		var str = "Predito: "+predito+" real: "+ datasetTeste[i][1]+"\n";
		$('#teste').append(str);
	};
}

// ler arquivo
var leitorDeCSV = new FileReader();

window.onload = function init() {
	leitorDeCSV.onload = leCSV;
}

function pegaCSV(inputFile) {
	var file = inputFile.files[0];
 	leitorDeCSV.readAsText(file);
}

function leCSV(evt) {

	var fileArr = evt.target.result.split('\n');
	console.log(fileArr);

	var linha = fileArr[0].trim();
	var nomesAtributos = linha.split(",");

	for (i = 0; i < nomesAtributos.length; i++) {
		atributos.push({
			nome: nomesAtributos[i],
			coluna: i
		});
	}

	for (i = 1; i < fileArr.length; i++) {
		linha = fileArr[i].trim();

		if (linha.length > 0) {
			var temp  = linha.split(",");
			temp = temp.map(function(num) {
							  return parseFloat(num);
							});
			registros.push( temp );
		}
	}

	registros = shuffle(registros);
	datasetTreino = registros;
	console.log(registros,atributos);
}

function holdout() {
	var nTreino = Math.ceil(registros.length/3)*2;
	datasetTreino = registros.slice(0,nTreino);
	datasetTeste = registros.slice(nTreino,registros.length);

	console.log("Treino",datasetTreino,"Teste",datasetTeste);
}

$(document).ready(function(){
	$('#treinar').click(treinar);
	$('#testar').click(function(e){
		e.preventDefault();
		testar();
	});
});

function draw(data) {
    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
	var radius = 1;
	ctx.lineWidth = 1;
	ctx.lineJoin = 'round';

    for(var key in data) {
        var x = data[key].d;
        ctx.fillStyle = data[key].color;
         for(var i = 0; i < x.length; ++i) {
             ctx.beginPath();
             ctx.arc(x[i][0], x[i][1], radius, 0, Math.PI * 2, true);
             ctx.fill();
             ctx.closePath();
         }

    }
}

