function DBSCAN(config){
	var eps, minPts, clusters, status, data;
	this.eps = config.eps || 1;
	this.minPts = config.minPts || 1;
	this.clusters = [];
	this.status = [];
	this.data = [];

	this.distanciaEuclidiana = function(pontoA,pontoB) {
		var sum = 0,
			q = pontoA.length;
		for (var i = 0; i < q; i++){
			sum += Math.pow((+pontoA[i]) - (+pontoB[i]),q);
		}
		var distancia = Math.pow(sum, 1/q);
		//console.log("Distancia entre "+pontoA+" e " + pontoB + " = "+ distancia);
		return distancia;
	}

	this.getVisinhos = function(ponto_idx) {
		var visinhos = [];
		var d = this.data[ponto_idx].c;

		for (var i = 0, length = this.data.length; i < length; i++) {
			//proprio ponto
			if (i == ponto_idx)
				continue;
			if (this.distanciaEuclidiana(d,this.data[i].c) <= this.eps)
				visinhos.push(i);
		};

		return visinhos;
	}

	this.setData = function(data) {

		for (i in data){
			this.data.push({
				c : data[i],
				cluster : -1
			});
		}

	}
	//agrupa os pontos de forma recursiva
	this.ExpandirCluster = function(ponto_idx, visinhos, cluster_idx) {
		this.clusters[cluster_idx - 1].push(ponto_idx); //adiciona o ponto ao cluster
		this.status[ponto_idx] = cluster_idx;

		for(var i = 0; i < visinhos.length; i++){
			var curr_ponto_idx = visinhos[i];
			if(this.status[curr_ponto_idx] === undefined){
				this.status[curr_ponto_idx] = 0; //marca com visitado e noise
				var curr_vizinhos = this.getVisinhos(curr_ponto_idx);
				var curr_num_vizinhos = curr_vizinhos.length;
				if(curr_num_vizinhos >= minPts){
					this.ExpandirCluster(curr_ponto_idx, curr_vizinhos, cluster_idx);
				}
			}
			if(this.status[curr_ponto_idx] < 1){
				this.status[curr_ponto_idx] = cluster_idx;
				this.clusters[cluster_idx - 1].push(curr_ponto_idx);
			}
		}
	}
	//algoritmo
	this.run = function(pontos){
		console.info("Dataset");
		console.log(pontos.join("; "));
		this.setData(pontos);
		for(var i = 0, l = this.data.length; i < l; i++){
			if(this.status[i] === undefined){
				this.status[i] = 0;
				var visinhos = this.getVisinhos(i);
				var num_visinhos = visinhos.length;
				if(num_visinhos < this.minPts){
					this.status[i] = 0; //noise
				}else {
					this.clusters.push([]);
					var cluster_idx = this.clusters.length;
					this.ExpandirCluster(i, visinhos, cluster_idx);
				}
			}
		}

		return this.status;
	}

	this.logCluters = function(label){
		var pontos = this.data;
		var grupos = [];

		label.forEach(function(cluster_idx,i){
			if(grupos[cluster_idx] === undefined)
				grupos[cluster_idx] = [pontos[i].c];
			else
				grupos[cluster_idx].push(pontos[i].c);
		});
		if (grupos.length > 0){
			console.info("Clusters resultantes");
			for(var i = 0, len = grupos.length; i < len; i++){
				console.log((i==0?"Noise":"Cluster "+i));
				if (grupos[i] !== undefined)
					console.log(grupos[i].join("; "));
			}
		}
	}
}