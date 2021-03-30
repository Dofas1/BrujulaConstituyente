function NotaToCandidatos(){ //copia la nota de la lista en cada candidato
var cFilD;
var cFilO;
var Parti;
var Lista;
var AuxStr;
var cColO;
var cColD;
var ColIni = 17;                                                                      			//columna priemra pregunta
var ColFin;
var AuxSing;
var Encontrado1=false;
var Encontrado2=false;
const Ini_Listas=119;																			//indice de inicio de Listas de Partidos en Arr_Candidatos
const Fin_Listas=196;																			//indice de inicio de Listas de Partidos en Arr_Candidatos
const Ini_Listas_P=1;																			//indice de inicio de Listas de Partidos en Arr_Candidatos
const Fin_Listas_P=103;																			//indice de inicio de Listas de Partidos en Arr_Candidatos
 
//MaxPreg = 35                                                                                 	// numero maximo de preguntas posibles
	ColFin = (ColIni - 1) + Arr_Preguntas.length                          							// ultima columna de preguntas
//Nota por lista *************************************************************************************************
	for (cFilD = 1;cFilD < N_Candidatos;cFilD++){ 		// recorre todos los candidatos
		Lista = Arr_Candidatos[cFilD][8];                                                       		//lee la lista
		Parti = Arr_Candidatos[cFilD][9];                                                      		//lee el partido
		for(cFilO = Ini_Listas;cFilO < Fin_Listas; cFilO++){ 					//recorre listas
			AuxStr = Arr_Partidos[cFilO][2]                                              		//Lee lista de la hoja respuesta
			if (AuxStr == Lista) {encontrado1=true; break;}                                         		//Si lista coincida con actual encontrado
		} 									//fin recorre listas
		if (encontrado1==false){//caso no encontró la lista
			for (cColO = ColIni;cColO < ColFin; cColO++){ //recorre cada respuesta
				cColD = cColO + 0                                                               //calcula columna de destino area listas
				Arr_Candidatos[cFilD][cColD] = 99                                                  //nota default a Default, muy lejos
			} //fin recorre respuestas
		}else{//escribe notas de las lista
			for (cColO = ColIni;cColO < ColFin; cColO++){ //recorre cada respuesta
				cColD = cColO + 0                                                               //calcula columna de destino area listas
				AuxSing = 98                                                                     //Supone que no va a encontrar nota en la lista
				if (Arr_Partidos[cFilO][cColO] != ""){ //caso si hay nota
					AuxSing = Arr_Partidos[cFilO][cColO]                                     //copia nota desde origen
					//AuxSing = AuxSing + (Rnd() - 0.5) * 0.6                                    //NO agrega ruido para elegir Lista
				}
				Arr_Candidatos[cFilD][cColD] = AuxSing                                              //copia nota
			} //fin recorre respuestas
		}
	} //fin candidato
	//Nota por Partidos *************************************************************************************************
	for (cFilD = 1;cFilD < N_Candidatos;cFilD++){ 		// recorre todos los candidatos
		Lista = Arr_Candidatos[cFilD][8];                                                       		//lee la lista
		Parti = Arr_Candidatos[cFilD][9];                                                      		//lee el partido
		for(cFilO = Ini_Listas_P;cFilO < Fin_Listas_P; cFilO++){ 					//recorre listas
			AuxStr = Arr_Partidos[cFilO][2]                                              //Lee lista de la hoja respuesta
			if (AuxStr = Parti){ encontrado2=true; break;}                                         //Si Partido coincida con actual
		} //fin recorre listas
		if (encontrado2==false){
			for (cColO = ColIni;cColO < ColFin; cColO++){ //recorre cada respuesta
				cColD = cColO + 52                                                              // columna destino area de partidos
				if (Arr_Candidatos[cFilD][cColD] == "") { //caso celda candidato esta vacía
					AuxSing = 97                                                                 //nota default
					Arr_Candidatos[cFilD][cColD] = AuxSing                                          //copia nota desde origen
				} // caso esta llena no modifica
			} //fin recorre respuestas
		}else{ //escribe notas de las lista
			for (cColO = ColIni;cColO < ColFin; cColO++){ //recorre cada respuesta
				cColD = cColO + 52                                                              // columna destino area de partidos
				if (Arr_Candidatos[cFilD][cColD] == "") { //caso celda candidato esta vacía
					AuxSing = 96                                                                 //Supone que no va a encontrar nota en la lista
					if (Arr_Partidos[cFilO][cColO] != ""){ //caso si hay nota
						AuxSing = Arr_Partidos[cFilO][cColO]                                 //copia nota desde origen
						AuxSing = AuxSing + (Rnd() - 0.5) * 0                                   //agrega ruido solo a los partidos
					}
					Arr_Candidatos[cFilD][cColD] = AuxSing                                         //copia nota
				} // caso casilla del candidato esta llena no cambia
			} //fin recorre respuestas
		}
	} //fin candidato
}