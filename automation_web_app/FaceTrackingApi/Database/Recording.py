from TrackingImage import TrackingImage

class Recording: 
    def __init__(self, id=0, name="untitled"):
        self.id         = id
        self.name       = name
        self.runLength  = 0
        self.frames     = []

    def addFrame(self, frame):
        self.frames.append(frame)

    def toDict(self):
        recordingDict = {
                    'id'        : self.id
                ,   'name'      : self.name
                ,   'runLength' : self.runLength
                ,   'frames'    : []
            }

        for frame in self.frames:
            recordingDict['frames'].append(frame.toDict())

        return recordingDict