from flask  import Flask, request, jsonify
from flask_cors import CORS
from Server import Server

import datetime

demo = False

app     = Flask  (__name__   )
CORS(app)
server  = Server (demo       )

#post frame to recordings
@app.route('/Frame', methods=['POST'])
def frame():
    if not request.json or not 'data' in request.json:
         return jsonify({'success': False}), 400

    data        = request.json['data']
    timeStamp   = str(datetime.datetime.now())

    server.onNewFrame(data, timeStamp)

    return jsonify({'success': True}), 201

#get recording previews, first frame only
@app.route('/RecordingPreviews', methods=['GET'])
def getRecordingPreviews():
    recordingPreviews = server.getRecordingPreviews()
    
    return jsonify({ 'recordings': recordingPreviews}), 201

#get recording
@app.route('/Recording/<id>', methods=['GET'])
def getRecording(id):
    recording = server.getRecording(id);

    return jsonify({'recording': recording}), 201

#delete recording
@app.route('/Recording/<id>', methods=['DELETE'])
def deleteRecording(id):
    success = server.deleteRecording(id)

    return jsonify({ 'success': success })

#rename recording


