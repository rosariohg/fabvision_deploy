import tensorflow as tf
import sys
import urllib
from flask import Flask, jsonify,request
import logging
from logging.handlers import RotatingFileHandler

# Loads label file, strips off carriage return
label_lines = [line.rstrip() for line 
                   in tf.gfile.GFile("./retrained_labels.txt")]

# Unpersists graph from file
with tf.gfile.FastGFile("./retrained_graph.pb", 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())
    _ = tf.import_graph_def(graph_def, name='')

def evaluate(image_data):
    res = {}
    with tf.Session() as sess:
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        
        predictions = sess.run(softmax_tensor, \
                {'DecodeJpeg/contents:0': image_data})
        
        # Sort to show labels of first prediction in order of confidence
        top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
        
        for node_id in top_k:
            human_string = label_lines[node_id]
            score = predictions[0][node_id]
            res[human_string] = str(score)
            #print('%s (score = %.5f)' % (human_string, score))
    return res


app = Flask(__name__)

@app.route('/')
def index():
    id = request.args.get('id', '').strip()
    image = request.args.get('image', '').strip()
    if not id or not image:
        return jsonify(id = id,
                       image = image,
                       error = "Not id or image",
                       res = {})
    
    if image.split('.')[-1:][0] != 'jpg':
        return jsonify(id = id,
                       image = image,
                       error = "Please send a JPG image",
                       res = {})
    
    response = urllib.urlopen(image)
    image_data = response.read()
    
    res = evaluate(image_data)
    #res = sorted(res.items(), key=lambda x: x[1]).reverse()
    #print res

    data = {'id': id, 'image': image, 'error': '', 'res': res}
    return jsonify(data)
    

if __name__ == "__main__":
    handler = RotatingFileHandler('info.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.run(host="0.0.0.0")
