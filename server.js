const express = require('express');
var morgan =require('morgan');
const app=express();
const func = require("./Funciones.js");
app.use(express.json());
app.use(morgan('dev'));

function iniciar() {
  app.listen(8888,()=>{
    console.log("Servidor Iniciado.");
  })
}
exports.iniciar = iniciar;
app.get('/',(req,res)=>{
  res.send("Hola ql");
});
app.post('/Procesa/:Respuestas',(req,res)=>{
  var par_recibido=req.params.Respuestas;             //Parametro recibido en la solicitud
  console.log(par_recibido);
  func.ProcesaRespuestas(par_recibido).then( resultado=>{
    console.log(resultado)
    res.json(resultado);
  });
});
