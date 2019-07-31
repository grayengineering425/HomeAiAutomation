import base64
import cv2
import sys
import queue
import time
import threading

sys.path.append('./Database')
sys.path.append('./DemoDatabase')

from TrackingModel  import TrackingModel
from TrackingImage  import TrackingImage
from Database       import SqlDatabase
from Recording      import Recording

class Server:
    def __init__(self, demo):
        self.trackingModel	                = TrackingModel()
        self.alive                          = True
        self.jobs                           = []
        self.trackingModel.onFrameProcessed = self.onFrameProcessed
        self.demo                           = demo
        self.database                       = None
        self.processingQueue                = queue.Queue()
        self.currentRecordingId             = 0
        self.lastFaceTime                   = time.time()

        if self.demo:
            self.database = SqlDatabase()

        else:
            self.database = SqlDatabase()

        self.p = threading.Thread(target = self.processImagesLoop)
        self.p.start()

    def __del__(self):
        self.processingQueue.put(lambda: self.kill())
        self.p.join()

    def onNewFrame(self, data, timeStamp):
        trackingImage = TrackingImage(data, timeStamp)

        self.processingQueue.put(lambda: self.trackingModel.infer(trackingImage))

    def processImagesLoop(self):
        while self.alive:
            latestJob = self.processingQueue.get()

            if latestJob is not None:
                latestJob()

    def onFrameProcessed(self, frameData):
        if not frameData:
            return

        if len(frameData.boundingBoxes) > 0:
            curTime = time.time()

            if self.currentRecordingId == 0 or curTime - self.lastFaceTime > 15:
                self.currentRecordingId = self.database.addNewRecording()
                self.lastFaceTime       = curTime

        frameData.recordingId = self.currentRecordingId

        self.database.addNewFrame(frameData)

    def kill(self):
        self.alive = False
        print("killing thread")

    def getRecordingPreviews(self):
        recordings = self.database.getRecordingPreviews()

        recordingJson = []
        for recording in recordings:
            recordingJson.append(recording.toDict())

        return recordingJson

    def getRecording(self, id):
        recording = self.database.getRecording(id)

        return recording.toDict()