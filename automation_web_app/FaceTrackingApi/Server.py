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
from Friend         import Friend

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
        self.p.daemon = True;
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

    def getRecordingPreviews(self):
        recordings = self.database.getRecordingPreviews()

        recordingJson = []
        for recording in recordings:
            recordingJson.append(recording.toDict())

        return recordingJson

    def getRecording(self, id):
        recording = self.database.getRecording(id)

        return recording.toDict()

    def deleteRecording(self, id):
        success = self.database.deleteRecording(id)

        return success

    def renameRecording(self, id, name):
        success = self.database.renameRecording(id, name)

        return success

    def getFriends(self):
        friends = self.database.getFriends()

        friendsJson = []
        for friend in friends:
            friendsJson.append(friend.toDict())

        return friendsJson

    def addNewFriend(self, name, relationship, data):
        encoding = "1,2,3,4,5";         #TODO: ADD FACE RECOGNITION MODEL

        success = self.database.addFriend(name, relationship, data, encoding);

        return success