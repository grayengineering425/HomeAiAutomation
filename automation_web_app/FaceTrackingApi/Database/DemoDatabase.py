import sqlite3

from TrackingImage  import TrackingImage
from IDatabase      import IDatabase

class DemoDatabase(IDatabase):
    def __init__(self):
        self.recordings = []

    def addNewFrame(self, frame, recordingId):
        if recordingId > len(self.recordings):
            self.addNewRecording()

        self.recordings[len(self.recordings) - 1].append(frame)

    def addNewRecording(self):
        recording = {
                            "id"    : len(self.recordings)
                        ,   "name"  : "untitled"
                        ,   "frames": []
                    }

        self.recordings.append(recording)