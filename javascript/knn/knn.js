function countStates(registros){
	var states = [];
	for (var i = 0; i < registros.length; i++){
		var countChanged = false;
		for (var j = 0; j < states.length; j++){
			if (states[j].classe == registros[i].classe){
				states[j].count += 1;
				countChanged = true;
			}
		}
		if (!countChanged){
			var state = {
					classe: registros[i].classe,
					count: 1
				};
			states.push(state);
		}
	}

	return states;
}

function getMostCommon(list){
	var mostCommon = list[0];

	for (var i = 0; i < list.length; i++){
		if (list[i].count > mostCommon.count){
			mostCommon = list[i];
		}
	}

	return mostCommon;
}

function holdout(registros) {
	//1/3 para teste e 2/3 para treino
	registros = shuffle(registros);
	var nTreino = Math.ceil(registros.length/3)*2;
	var dataSetTreino = registros.slice(0,nTreino);
	var dataSetTeste = registros.slice(nTreino,registros.length);
	console.log("Dividindo dados para treino e teste ... .. .");
	return {
		treino : dataSetTreino,
		teste : dataSetTeste
	}
}

function distanciaEuclidiana(pontoA,pontoB) {
	var sum = 0,
		q = pontoA.length;
	for (var i = 0; i < q; i++){
		sum += Math.pow((+pontoA[i]) - (+pontoB[i]),q);
	}
	return Math.pow(sum, 1/q);
}

function distanciaAtributosCategoricos(pontoA,pontoB) {
	var sum = 0,
		n = pontoA.length;
	for (var i = 0; i < n; i++){
		sum += pontoA[i] === pontoB[i] ? 0 : 1;
	}

	return sum;
}

function calcularDistancias(pontoN,data) {
	var n = data.length, distancias = [], ldi = data[0].length;
	//console.info("Calulando distancias ... .. .");
	for (var i = 0; i < n; i++){
		var pontoA = data[i].slice(0, ldi - 1);
		var dist = nominal ? distanciaAtributosCategoricos(pontoA, pontoN) : distanciaEuclidiana(pontoA, pontoN);
		distancias.push({
			distancia: dist,
			classe: data[i][ldi - 1]
		});
	}
	//console.log(distancias);
	return distancias;
}

function ordenarDados(data) {
	return data.sort(function(a,b){
		return (+a.distancia) - (+b.distancia);
	});
}

function classificar(exemplo,k,data) {

	var arrDistancias = calcularDistancias(exemplo,data);
	var dadosOrdenados = ordenarDados(arrDistancias);
	var frequenciaClasse = countStates(dadosOrdenados.slice(0,k));
	var classe = getMostCommon(frequenciaClasse).classe;
	//console.log(classe);
	return classe;
}