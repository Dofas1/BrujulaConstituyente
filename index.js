let server = require("./server");
let funciones = require("./funciones");
const fs = require('fs');
const readline = require("readline");

var Arr_Comunas = new Array;
var Arr_Candidatos = new Array;
var Arr_Preguntas = new Array;
var Arr_Respuestas= new Array;

var cColR 				//contador columna respuesta
var Distr  				//distrito del encuestado
var MaxPreg 			// numero de preguntas validas
var NCand 				//numero de candidatos del distrito
var NCons 				//numeros de constituyentes elegidos
var Pobl As Long     	//poblacion del distrito


server.iniciar();
leeArchivo("./Comunas.csv").then( Arr_Lineas=> {
	CP_Array(Arr_Lineas,Arr_Comunas);
	leeArchivo("./Candidatos.csv").then( Arr_Lineas=> {
		CP_Array(Arr_Lineas,Arr_Candidatos);
		leeArchivo("./Preguntas.csv").then( Arr_Lineas=> {
			CP_Array(Arr_Lineas,Arr_Preguntas);
			leeArchivo("./Respuestas.csv").then( Arr_Lineas=> {
				CP_Array(Arr_Lineas,Arr_Respuestas);
				//Aqui Tengo todos los archivos en memoria
				//ResultadoLectura();
			})		
		})
	})
})
function leeArchivo(archivo){//Lee archivo y entrega como matriz separada por punto y coma
var datos;
var Arr_Lineas = new Array;
	return new Promise(function(resolve,reject){
	if (fs.existsSync(archivo)){
		console.log("Archivo " + archivo + " Existe");
		fs.readFile(archivo, 'utf8', (error, datos) => {
		if (error) {
			reject(error);
		}else{
			Arr_Lineas = datos.split("\r\n");
			for (var i=0;i< Arr_Lineas.length;i++){
				Arr_Lineas[i]=Arr_Lineas[i].split(";");
			}
			resolve(Arr_Lineas);
		}
		});
	}else{
		console.log("No se Encontro Archivo");
	}
	})
}
exports.leeArchivo = leeArchivo;
function ResultadoLectura(){
	console.log("Arr_Comunas*****************************************************************************");
	console.log(Arr_Comunas[0]);	
	console.log("Arr_Candidatos**************************************************************************");
	console.log(Arr_Candidatos[0]);	
	console.log("Arr_Preguntas***************************************************************************");
	console.log(Arr_Preguntas[0]);	
	console.log("Arr_Respuestas**************************************************************************");
	console.log(Arr_Respuestas[0]);	
}
function CP_Array(Arr_origen,Arr_Destino){
	for (var i=0;i<Arr_origen.length;i++){
		Arr_Destino[i]=Arr_origen[i];
	}
}
function BuscaDistrito(Arr_Comunas){
var cFil 
var Comuna 

    Comuna = Arr_Respuestas[1,1]
    For (cFil = 2;cFil< 347;cFil++){
        If (Comuna = Arr_Comunas[cFil, 2]){
			return{
				Distr = Arr_Comunas[cFil, 4] //distrito del encuestado
				NCand = Arr_Comunas[cFil, 6] //numero de candidatos del distrito
				NCons = Arr_Comunas[cFil, 5] //numeros de constituyentes elegidos
				Pobl  = Arr_Comunas[cFil, 7]  //poblacion del distrito
			}
		} 
    }
	
}


