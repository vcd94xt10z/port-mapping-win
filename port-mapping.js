'use strict';

const fs       = require('fs');
const { exec } = require("child_process");

let rawdata = null;
let sample  = {
	"reset": false,
	"addrFrom": "192.168.242.131",
	"addrTo": "192.168.0.10",
	"portList": [
		39015,39030,39032
	],
	"portRange": [
	    {"from":40300,"to":40400},
		{"from":51000,"to":51100}
	]
};

try {
	rawdata = fs.readFileSync('map.json');
}catch(e){
	console.log("Erro em ler arquivo de mapeamento, crie um arquivo map.json conforme exemplo");
	console.log(sample);
	return;
}

let obj      = JSON.parse(rawdata);
let commands = [];
let port     = 0;
let com      = "";

console.log("Configuração");
console.log(obj);

function add(from,to,port){
	var c = "netsh interface portproxy add v4tov4 listenaddress="+to+" listenport="+port+" connectaddress="+from+" connectport="+port;
	return c;
}

function del(from,to,port){
	var c = "netsh interface portproxy delete v4tov4 listenaddress="+to+" listenport="+port;
	return c;
}

function runCommand(cmd){
	exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    //console.log(`stdout: ${stdout}`);
});
}

// limpando regras anteriores
if(obj.reset){
  commands.push("netsh interface portproxy reset");
}

// liberação de porta avulsa
for(var i in obj.portList){
	port = obj.portList[i];
	//commands.push(del(obj.addrFrom,obj.addrTo,port));
	commands.push(add(obj.addrFrom,obj.addrTo,port));
}

// liberação de porta range
for(var i in obj.portRange){
	var item = obj.portRange[i];
	for(var j = item.from; j<=item.to;j++){
		//commands.push(del(obj.addrFrom,obj.addrTo,port));
		commands.push(add(obj.addrFrom,obj.addrTo,j));
	}
}

// executando comandos
for(var i in commands){
	com = commands[i];
	console.log(com);
	runCommand(com);
}
