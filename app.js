// Load the SDK and UUID
var AWS = require('aws-sdk'),
	uuid = require('node-uuid'),
	fs = require('fs');

AWS.config.update({ accessKeyId: 'AKIAIRP7IULKHTN36RKQ', secretAccessKey: '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' });

// Read in the file, convert it to base64, store to S3
fs.readFile('5.png', function (err, data) {
	if (err) { throw err; }

	var base64data = new Buffer(data, 'binary');

	var i = 0;
	for (; i < 10; i++) {
		var s3 = new AWS.S3();
		s3.upload({
			Bucket: 'fabvisionimage',
			Key: `${i}.png`,
			Body: base64data,
			ACL: 'public-read'
		},function (err, data,i) {
			console.log(arguments);
				if (err) {
					return alert('There was an error uploading your photo:', err.message);
			}
			console.log(`Successfully uploaded package - ${i}`);
		});
	}

});
