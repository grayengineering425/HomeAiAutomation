from TrackingImage import TrackingImage

class Recording: 
    def __init__(self, id=0, name="untitled"):
        self.id     = id
        self.name   = name
        self.frames = []

    def addFrame(self, frame):
        self.frames.append(frame)

    def toDict(self):
        recordingDict = {
                    'id'    : self.id
                ,   'name'  : self.name
                ,   'frames': []
            }

        for frame in self.frames:
            recordingDict['frames'].append(frame.toDict())

        return recordingDict