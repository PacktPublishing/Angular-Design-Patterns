var r = new XMLHttpRequest(); 
r.open("POST", "webservice", true);
r.onreadystatechange = function () {
	if (r.readyState != 4 || r.status != 200) return; 
	console.log(r.responseText);
};
r.send("a=1&b=2&c=3");