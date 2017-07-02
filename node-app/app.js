var express = require("express"),
	AWS = require('aws-sdk'),
	uuid = require('node-uuid'),
	fs = require('fs'),
	http = require("http"),
	socketio = require("socket.io"),
	Log = require('log');



var app = new express();
var http_server = http.Server(app);
var io = socketio(http_server);
log = new Log('debug');
var port = 4000;
var cont = 0;
var TF_HOST = 'http://fabvision-tf:5000';

AWS.config.update({
	accessKeyId: 'AKIAJQ4KZH3OQEDTV26A',
	secretAccessKey: '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'
});

app.use(express.static(__dirname + "/public"));
app.get('/',function(req,res){
	res.redirect('index.html');
});


function save_image(image, name) {
	fs.writeFile(name, image);
}

function send_to_s3(image_buffer, name, callback) {
	var base64data = new Buffer(image_buffer, 'binary');
	var s3 = new AWS.S3();
	s3.upload({
		Bucket: 'fabvisionimages',
		Key: `${name}`,
		Body: base64data,
		ACL: 'public-read'
	},function (err, data) {
		//console.log(arguments);
		if (err)
			console.log ('There was an error uploading your photo:', err.message)
		else{
			callback(data);
		}
	});
}

function send_to_tf(url, key, callback) {
	var url = TF_HOST+'?id='+encodeURIComponent(key)+
						'&image='+encodeURIComponent(url);

	http.get(url, function(res){
	    var body = '';

	    res.on('data', function(chunk){
	        body += chunk;
	    });

	    res.on('end', function(){
	    	var jsonresponse = ''
	    	try {
			    jsonresponse = JSON.parse(body);
		  	} catch (e) {
			    console.error('Error en TF: ',e);
			    return;
			}
	        if (jsonresponse.error == '')
	        	callback(jsonresponse);
	        else
	        	console.log("Error en TF: ", e);
	    });
	}).on('error', function(e){
	      console.log("Got an error requiring TF: ", e);
	});
}

io.on('connection',function(socket){
	
	socket.on('stream',function(image){
		socket.broadcast.emit('stream',image);

		// convert image to buffer
		var item_image = image.replace(/^data:image\/(webp|png|jpg);base64,/, "") ; 
		var buf = new Buffer(item_image, 'base64');

		// send image to aws
		send_to_s3(buf, `${cont}.jpg`, function(resp_s3){

			console.log(`Successfully uploaded image - ${cont}.jpg`);
			send_to_tf(resp_s3.Location, resp_s3.key, function(resp_tf){
				console.log(resp_tf);
				io.emit('results',resp_tf);
			});
		});
		
		cont +=1;
	
	});
});

http_server.listen(port,function(){
	log.info('Servidor escuchando en el puerto %s',port);  
});