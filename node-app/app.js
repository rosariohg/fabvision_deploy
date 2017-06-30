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

AWS.config.update({
	accessKeyId: 'AKIAIRP7IULKHTN36RKQ',
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
		Bucket: 'fabvisionimage',
		Key: `${name}`,
		Body: base64data,
		ACL: 'public-read'
	},function (err, data) {
		console.log(arguments);
		if (err)
			console.log ('There was an error uploading your photo:', err.message)
		else{
			callback();
			//console.log(`Successfully uploaded package - ${name}`);
		}
	});
}

function send_to_tf(url, key, callback) {

}

io.on('connection',function(socket){
	
	socket.on('stream',function(image){
		socket.broadcast.emit('stream',image);

		// convert image to buffer
		var item_image = image.replace(/^data:image\/(webp|png|jpg);base64,/, "") ; 
		var buf = new Buffer(item_image, 'base64');

		// send image to aws
		send_to_s3(buf, `${cont}.jpg`, function(resp){
			send_to_tf(resp.Location, resp.key)
		});
		
		cont +=1;
	
	});
});

http_server.listen(port,function(){
	log.info('Servidor escuchando en el puerto %s',port);  
});