function upload(el) {
	var upload = document.getElementById(el);
	if (typeof window.FileReader === 'undefined') {
		alert('File API & FileReader não suportados');
	}

	upload.onchange = function (e) {
		e.preventDefault();
		var file = upload.files[0],
			reader = new FileReader();
		reader.onload = function (event) {
			return lerArquivo(event);
		};
		reader.readAsText(file);
		return false;
	};
}

window.dataSet = [];

function lerArquivo (evt) {
	var fileArr = evt.target.result.split('\n');
	var linha = fileArr[0].trim();
	for (var i = 0, length = fileArr.length; i < length; i++) {
		linha = fileArr[i].trim();
		if (linha.length > 0) {
			dataSet.push(linha.split(','));
		};
	};
}