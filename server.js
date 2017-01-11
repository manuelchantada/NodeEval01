var http=require('http');
var url=require('url');
var fs=require('fs');
var nodemailer = require("nodemailer");
const querystring = require('querystring');
var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'png'  : 'image/png',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var serverMail = "manulito85";
var serverMailpass = "1pipienpinamar";

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

servidor.listen(process.env.PORT || 8888);

console.log("Servidor iniciado");

function encaminar(pedido,respuesta,camino) {	
	switch (camino) {
		case 'public/enviar': {
			enviar(pedido, respuesta)
			break;
		}			
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}

function enviar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){ 
         info += datosparciales;
    });

    pedido.on('end', function(){
      var formulario = querystring.parse(info);
      var nombre = formulario['nombre'];
      var remitente = formulario['remitente'];
      var asunto = formulario['asunto'];
      var contenido = formulario['contenido'];
      enviarMail(nombre,remitente,asunto,contenido);

		var pagina='<!doctype html><html><head></head><body>'+
	           'Mensaje enviado.'+
			     '<a href="index.html">Volver</a>'+
	           '</body></html>';	        		 
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
		respuesta.end(pagina);
    });	
}


function enviarMail(nombre, remitente, asunto, contenido) {
	var smtpTransport = nodemailer.createTransport('smtps://'+serverMail+'%40gmail.com:'+serverMailpass+'@smtp.gmail.com');
	var response;

	smtpTransport.sendMail({
   from: nombre+ "<"+remitente+">", 
   to: serverMail+"@gmail.com", 
   subject: asunto, // Subject line
   text: contenido,
	}, 
	function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       console.log("Mensaje enviado: " + response.message);
	   }
	});
}