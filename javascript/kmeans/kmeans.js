function kmeans (k,dataset,aCentroide) {
	var fDataset = inicializarDataset(dataset);
	var i = 0;
	do {

		console.log("iteração "+ (i+1));
		var c = formarCluster(fDataset,k,aCentroide);
		var aCentroide = recalcularCentroide(c.clusters);
		fDataset = c.data;
		i++;
	}while(c.mudou || i == MAXINTERACAO)

	window.centroidePlot = aCentroide;
	window.dataPlot = fDataset;

}

function inicializarDataset (data) {
	var dataset = [];
	for (j in data){
		var instacia = {
			caracteristicas : data[j].map(function(n){return +n}),
			cluster : -1
		}
		dataset.push(instacia);
	}

	return dataset;
}

function formarCluster(data,k,aCentroide) {
	var aCluster = new Array(k);
	var mudou = false;

	for (p in data){
		var ponto = data[p].caracteristicas;
		var distancia = Infinity; // distancia inicial
		var cluster = -1; // cluster inicial
		for (c in aCentroide){
			var d = distanciaEuclidiana(ponto, aCentroide[c]);
			if (d < distancia){
				distancia = d;
				cluster = c;
			}
		}
		// atribui a instacia ao centroide mais proximo
		if (data[p].cluster !== +cluster){
			mudou = true;
			data[p].cluster = +cluster;
		}

		if (aCluster[cluster] === undefined)
			aCluster[cluster] = [ponto];
		else
			aCluster[cluster].push(ponto);

		console.log("Instacia [" + ponto + "] cluster " + (+cluster+1));
	}

	return {'data' : data, 'mudou': mudou, 'clusters' : aCluster};
}

function distanciaEuclidiana(pontoA,pontoB) {
	var sum = 0,
		q = pontoA.length;
	for (var i = 0; i < q; i++){
		sum += Math.pow((+pontoA[i]) - (+pontoB[i]),q);
	}
	var dist = Math.pow(sum, 1/q);
	//console.log("Distância entre "+pontoA+" e "+pontoB+" = " + dist);
	return dist;
}


function recalcularCentroide(aCluster) {
	var k = aCluster.length;
	var aCentroide = new Array(k);
	for (var i = 0; i < k; i++){
		var centroide = calcularCentroide(aCluster[i]);
		aCentroide[i] = centroide;
	}

	return aCentroide;
}

function calcularCentroide (cluster) {
	var dimensao = cluster[0].length;
	var n = cluster.length;
	var novoCentroide = new Array(dimensao);

	for (x in cluster){
		var ponto = cluster[x];
		for (y in ponto){
			if (novoCentroide[y] === undefined ){
				novoCentroide[y] = ponto[y];
			}else
				novoCentroide[y] += ponto[y];
		}
	}
	novoCentroide = novoCentroide.map(function(num){
		return num/n;
	});
	console.log("Novo centroide: "+ novoCentroide);
	return novoCentroide;

}

function draw(canvas,data,aCentroide) {

	var c = document.getElementById(canvas);
	var ctx = c.getContext('2d');

	const Ox = c.width/2;
	const Oy = c.height/2;

	ctx.translate(Ox,Oy);
	ctx.scale(2,-2);

	var s = 20;

	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.strokeStyle = "#DDDDDD";
    ctx.moveTo(-200, 0);
    ctx.lineTo(400, 0);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();

    ctx.moveTo(0,200);
    ctx.lineTo(0,0);
    ctx.moveTo(0,0);
    ctx.lineTo(0,-200);
	ctx.stroke();
	ctx.closePath();


	var radius = 2;
	ctx.lineWidth = 1;
	ctx.lineJoin = 'round';

	for (i in data){
		if (data[i].cluster === 0)
			ctx.fillStyle = "#FF0000";
		else
			ctx.fillStyle = "#0000FF";
		ctx.beginPath();
		ctx.arc((data[i].caracteristicas[0]*s), (data[i].caracteristicas[1]*s), radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
	}

	ctx.fillStyle = '#FF0000';
	ctx.fillRect((aCentroide[0][0]*s), (aCentroide[0][1]*s), 4, 4);
	ctx.fillStyle = '#0000FF';
	ctx.fillRect((aCentroide[1][0]*s), (aCentroide[1][1]*s), 4, 4);
}