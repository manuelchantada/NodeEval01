var nodemailer = require("nodemailer");



var smtpTransport = nodemailer.createTransport('smtps://manulito85%40gmail.com:1pipienpinamar@smtp.gmail.com');

smtpTransport.sendMail({
   from: "Veronica Pineyro <kdsnkfns@gmail.com>", // sender address
   to: "Veronica <manulito85@hotmail.com>", // comma separated list of receivers
   subject: "Hello ✔", // Subject line
   text: "Prueba de envio con nodejs. Hello world ✔" // plaintext body
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
});