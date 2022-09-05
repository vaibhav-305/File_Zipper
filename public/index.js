window.onload = function () {
	decodeBtn = document.getElementById("decode");
	encodeBtn = document.getElementById("encode");
	uploadFile = document.getElementById("uploadfile")
	submitBtn = document.getElementById("submitbtn");
	step1 = document.getElementById("step1");
	step2 = document.getElementById("step2");
	step3 = document.getElementById("step3");
	body = document.getElementById('bdy')

	submitBtn.onclick = function () {
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again");
			return;
		}
		let nameSplit = uploadedFile.name.split('.');
		var extension = nameSplit[nameSplit.length - 1].toLowerCase();
		if (extension != "txt" && extension !="huff" ) {
			alert("Invalid file type (." + extension + ") \nPlease upload a valid .txt or .huff file and try again");
			return;
		}
		document.getElementById("step1").style.display = "none";
		document.getElementById("step2").style.display = "inline-flex";
		document.getElementById("startagain").style.visibility = "visible";
	}

	encodeBtn.onclick = function () {
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again");
			return;
		}
		console.log(uploadedFile.size);
		if(uploadedFile.size === 0){
			alert("You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}	
		else if(uploadedFile.size <= 350){
			alert("The uploaded file is very small in size (" + uploadedFile.size +" bytes) !\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}
		else if(uploadedFile.size < 1000){
			alert("The uploaded file is small in size (" + uploadedFile.size +" bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!");
		}
		onclickChanges2("Compressing your file ...\n", "Compressed");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            fetch('/encode', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }else
					alert('some error occured, try again');
            }).then(data => {
                if (data) {
                    let encodedData = data.outputData;
			        myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.huff", encodedData);
			        ondownloadChanges('comp',text.length,encodedData.length);
                }
            }).catch(err => {
                alert('some error occured, try again');
                console.error(err)
            });
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
		document.getElementById("step2").style.display = "none";
		document.getElementById("step3").style.display = "inline-flex";
	}

	decodeBtn.onclick = function () {
		//console.log("decode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		onclickChanges2("De-compressing your file ...\n", "De-Compressed");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			fetch('/decode', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text
				})
			}).then(response => {
                if (response.ok) {
                    return response.json();
                }else
					alert('Only .huff files can be decompressed, try again.');
            }).then(data => {
                if (data) {
                    let decodedData = data.outputData;
			        myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedData);
			        ondownloadChanges('decomp',text.length,decodedData.length);
                }
            }).catch(err => {
                alert('some error occured, try again');
                console.error(err)
            });
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
		document.getElementById("step2").style.display = "none";
		document.getElementById("step3").style.display = "inline-flex";
	}

}

function onclickChanges2(secMsg, word) {
	document.getElementById('bdy').style.backgroundColor="#49b4f7"
	decodeBtn.disabled = true;
	encodeBtn.disabled = true;
	step3.innerHTML = "";
	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	step3.appendChild(msg2);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = word + " file will be downloaded automatically!";
	step3.appendChild(msg3);
}

function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}

function ondownloadChanges(op,beforesz,aftersz) {
	step3.innerHTML = "";
	let img = document.createElement("img");
	img.src = "done.jpg";
	img.id = "doneImg";
	step3.appendChild(img);
	var br = document.createElement("br");
	step3.appendChild(br);
	let msg3 = document.createElement("div");
	msg3.className = "text2";
	if(op==='comp')
		msg3.innerHTML = `Compression complete and file will be downloaded automatically.<br>Original File Size: <b>${beforesz} bytes</b><br>Compressed file size: <b>${aftersz} Bytes</b>`;
	else
		msg3.innerHTML = `De-Compression complete and file will be downloaded automatically.<br>Compressed File Size: <b>${beforesz} bytes</b><br>De-compressed file size: <b>${aftersz} Bytes</b>`;
	step3.appendChild(msg3);
}