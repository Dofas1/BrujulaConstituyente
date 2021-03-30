let server = require("./server.js");
let funciones = require("./funciones.js");
const fs = require("fs");
//const readline = require("readline");

var Arr_Comunas = new Array;
var Arr_Candidatos = new Array;
var Arr_Preguntas = new Array;
var Arr_Respuestas= new Array;
var Arr_Partidos= new Array;
var Arr_Resultado=new Array;


var cColR 				//contador columna respuesta
var Distr  				//distrito del encuestado
var MaxPreg 			// numero de preguntas validas
var NCand 				//numero de candidatos del distrito
var NCons 				//numeros de constituyentes elegidos
var Pobl   				//poblacion del distrito
var MaxDisC=0;						//Distancia al candidato mas lejano
var pMaxDis=0;						//Puntero al candidato mas lejano

const N_Candidatos = 1279;																		//Numero de Candidatos totales


server.iniciar();
leeArchivo("./Comunas.csv").then( algo=> {
	CP_Array(algo,Arr_Comunas);
	leeArchivo("./Candidatos.csv").then( Arr_Lineas=> {
		CP_Array(Arr_Lineas,Arr_Candidatos);
		leeArchivo("./Preguntas.csv").then( Arr_Lineas=> {
			CP_Array(Arr_Lineas,Arr_Preguntas);
			leeArchivo("./Respuestas.csv").then( Arr_Lineas=> {
				CP_Array(Arr_Lineas,Arr_Respuestas);
				leeArchivo("./PosturasPartidos.csv").then( Arr_Lineas=> {
					CP_Array(Arr_Lineas,Arr_Partidos);
					//Aqui Tengo todos los archivos en memoria
					ResultadoLectura();
					RecomiendaCandidato();
				})		
			})		
		})
	})
})
//-----------------------------------------------------------------------------------------------------------------------------------------
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
				Arr_Lineas[i]=(Arr_Lineas[i].split(","));
			}
			resolve(Arr_Lineas);
		}
		});
	}else{
		console.log("No se Encontro Archivo");
	}
	})
}
//exports.leeArchivo = leeArchivo;
//-----------------------------------------------------------------------------------------------------------------------------------------
function EscribeArchivo(archivo,contenido){
	var stream = fs.createWriteStream(archivo);
	stream.once('open', function(fd) {
		contenido.forEach(function(linea){
			var Auxlinea=linea[0];
			for (var i=1;i<linea.length;i++){
				//stream.write(contenido)}
				Auxlinea=Auxlinea+","+linea[i]
			}
			//console.log(Auxlinea);
			stream.write(Auxlinea+"\r\n");
		});
		stream.end();
	});
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function ResultadoLectura(){
	//console.log(Arr_Candidatos[1])
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function CP_Array(Arr_origen,Arr_Destino){
	for (var i=0;i<Arr_origen.length;i++){
		Arr_Destino[i]=Arr_origen[i];
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function BuscaDistrito(){
var Comuna; 
var res=false;
	return new Promise(function(resolve,reject){
		try{
			Comuna = Arr_Respuestas[1][1]
			for (var cFil = 2;cFil< 347;cFil++){
				if (Comuna == Arr_Comunas[cFil][2]){
					Distr = Arr_Comunas[cFil][4]; //distrito del encuestado
					NCand = Arr_Comunas[cFil][6]; //numero de candidatos del distrito
					NCons = Arr_Comunas[cFil][5]; //numeros de constituyentes elegidos
					Pobl  = Arr_Comunas[cFil][7];  //poblacion del distrito
					res=true;
					resolve(res);
					//console.log("Encontrado");
					return;
				} 
			}
		}catch(e){
				reject(e);
		}
	})
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function ConsolaSi(valor,mensaje){
	if (valor >20){console.log(valor + " " + mensaje);}
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function CalculaDistanciaCandidato(filp) {
//var res=0;
var Dis=0;                                                     //distancia vectoriaal
var cFilR=0;                                                   //contador fila en hoja respuestas
var NotaR=0;                                                   //nota de la hoja de rspuestas
var NotaC=0;                                                   //nota del candidato
var Ponde=0;                                                   //ponderacion de la pregunta
const FilToCol=69;
        try{
			for (cFilR = 1 ; cFilR < (2 - 1) + MaxPreg ;cFilR++){ 	//recorre todas las preguntas
				if (Arr_Preguntas[cFilR][1].length != 0) { 					//caso la pregunta es valida
					if (Arr_Respuestas[cFilR+1][1].length == 0) {
						NotaR = 99;                              		//caso casilla vacía
					}else{
						NotaR = Arr_Respuestas[cFilR+1][1].replace(",",".");             	//caso casilla buena
					}
					Ponde = Arr_Preguntas[cFilR][6].replace(",",".");               		//lee ponderacion de  las pregunta
					NotaC = Arr_Candidatos[filp][cFilR + FilToCol].replace(",","."); 		//lee nota individual del candidato
				}
				Dis = Dis + Math.pow((Ponde * (NotaR - NotaC)),2);       	//suma distancia parcial
			}
				ConsolaSi(filp,"Distancia Candidato "+ filp+"--  NotaR : " + NotaR + " Ponde : " + Ponde + " NotaC : " + NotaC);
			res = Math.sqrt(Dis);				//distancia vectorial
			return(res);	
		}catch(e){
			console.log("Error en DistanciaCandidato " + e.message);
			//reject(e);
		}
	//})
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function CalculaDistanciaLista(filp){ 
//var res=0;
var Dis = 0                                                   //distancia vectoriaal
var cFilR                                                     //contador fila en hoja respuestas
var NotaR                                                     //nota de la hoja de rspuestas
var NotaC                                                     //nota del candidato
var Ponde                                                     //ponderacion de la pregunta
const FilToCol =17;                                           //constante fila respuesta to Arr_Candidatos
//	return new Promise(function(resolve,reject){
	try{
		for (cFilR = 1 ; cFilR < (2 - 1) + MaxPreg;cFilR++){ 	//recorre todas las preguntas
            if (Arr_Preguntas[cFilR][1].length!=0) { 					//caso la pregunta es valida
                if (Arr_Respuestas[cFilR+1][1].length==0) {
                    NotaR = 99;                  			//caso casilla vacía
                }else{
                    NotaR = Arr_Respuestas[cFilR+1][1].replace(",",".");             	//caso casilla buena
                }
                Ponde = Arr_Preguntas[cFilR][5].replace(",",".");               		//lee ponderacion de  las pregunta
                NotaC = Arr_Candidatos[filp][cFilR + FilToCol].replace(",","."); 		//lee nota individual del candidato
//				console.log(cFilR+" NotaR : " + NotaR + " Ponde : " + Ponde + " NotaC : " + NotaC);
			}
            Dis = Dis + Math.pow((Ponde * (NotaR - NotaC)),2);       	//suma distancia parcial
        }
		
        res = Math.sqrt(Dis);                	//distancia vectorial
		//console.log(filp + ": CalculaDistanciaLista: qrtt: "+res+" dis: "+Dis);
		return(res);	
	}catch(e){
			console.log("Error en CalculaDistanciaLista: " + e.message);
			//reject(e);
	}
	//})
}
//-----------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------
function RecorreCandidatos(){
var res=false;
var cFilC;							//contador candidatos
var cFilW=0;							//contador fila Write
var DisL;							//distancia a la lista
var DisC;							//distancia al candidato

	//return new Promise(function(resolve,reject){
	try{
	MaxDisC=0;
	pMaxDis=0;
	for (cFilC = 1;cFilC < N_Candidatos;cFilC++){ //recorre candidatos
		if (Distr !== Arr_Candidatos[cFilC][3]){continue;} // solo los candidatos del distrito
			ConsolaSi(cFilC," Distrito : " + Distr + " "  +Arr_Candidatos[cFilC][3]);
			DisL=CalculaDistanciaLista(cFilC); //calcula distancia con lista
			ConsolaSi(cFilC,"DistanciaLista Terminado: " +DisL);
			DisC=CalculaDistanciaCandidato(cFilC)
			ConsolaSi(cFilC,"DistanciaCandidato terminada "+DisC);
			//if (DisL < 100) { //caso distancia con lista es chica
			//	if (DisC > MaxDisC){ //caso este caso es peor que el anterior
			//		MaxDisC = DisC   //actualiza peor caso
			//		pMaxDis = cFilW  //guarda puntero del peor
			//	}
				Arr_Resultado.push([Arr_Candidatos[cFilC][4],Arr_Candidatos[cFilC][5],Arr_Candidatos[cFilC][6],
									Arr_Candidatos[cFilC][7],Arr_Candidatos[cFilC][8],Arr_Candidatos[cFilC][9],
									Arr_Candidatos[cFilC][14],Arr_Candidatos[cFilC][0],DisL,DisC]);
				cFilW ++ ;
		
		
	} //proximo candidato
	console.log(cFilW);
	return(cFilW)
	
	}catch(e){
			console.log("Error en CalculaDistanciaLista: " + e.message);
			return(e);
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------------
function RecomiendaCandidato(){
var FCerca=new Array(5);						//Fila de los mas cercanos
var DCerca=new Array(5);						//Distancia de los mas cercanos
var MaxFil;							//fila maxima
var Arr_Salida=new Array;
var Arr_Res_Peor=new Array;

    MaxPreg = 45
    console.log("Buscando Distrito");
    BuscaDistrito().then( res=> {
	if (res=true){
		console.log("Distrito Encontrado");
		//guarda Mejor****************************************************************************
		console.log("Recorriendo Candidatos  ");
		
		res=RecorreCandidatos();
			console.log("RecorreCandidatos Res: "+res);
			if (res>0){
				console.log("Ordenando Segun Notas");
				//Ordena segun Notas*********************************************************************
				MaxFil = res - 1   //ultima fila escrita
				Arr_Resultado = Arr_Resultado.sort( function comparar ( a, b ){ return a[8] - b[8]; } );
				Arr_Resultado = Arr_Resultado.sort( function comparar ( a, b ){ return a[9] - b[9]; } );
				//Ordena La escritura del archivo de Salida
				//Datos de comunas *****************************************************
				Arr_Res_Peor.push(Arr_Resultado[Arr_Resultado.length - 1]);//Ultimo elemento guardado como el peor
				Arr_Resultado.pop(); //Elimina ultimo elemento 
				Arr_Salida.push(["#","N Candidatos","N electros","Poblacion del distrito","Distrito"]);
				Arr_Salida.push([NCand,NCons,Pobl,Distr]);
				//Encabezado resultados Mejor Candidato**********************************************************
				Arr_Salida.push(["#","Mejores 3 Candidatos********************"]);
				Arr_Salida.push(["#","Nombre1","Nombre2","Apellido1","Apellido2","Lista","Partido","Web","Codigo candidato","Dist L","Dist C"]);
				for (var i=0;i<3;i++){Arr_Salida.push(Arr_Resultado[i]);}
				Arr_Salida.push(["# Peor Candidato********************"]);
				Arr_Salida.push(["#","Nombre1","Nombre2","Apellido1","Apellido2","Lista","Partido","Web","Codigo candidato","Dist L","Dist C"]);
				Arr_Salida.push([Arr_Res_Peor[0]]);
				//guarda Peor****************************************************************************
				console.log(Arr_Salida)
				EscribeArchivo("Resultado.csv",Arr_Salida);
			}
		//});
	}else{
			console.log("No Se Encontro Distrito");
			return;
		}
	})
}
