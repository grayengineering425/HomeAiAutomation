import sqlite3
import sys

sys.path.append('../Recording')

from TrackingImage  import TrackingImage
from Recording      import Recording
from IDatabase      import IDatabase

class SqlDatabase(IDatabase):
    def __init__(self):
        self.databasePath = "C:/HomeAiAutomation/automation_web_app/FaceTrackingApi/Database/FaceTracking.db"             #TODO, not sure how relative paths work in python...

    def addNewFrame(self, frame):
        conn    = sqlite3.connect(self.databasePath)
        cursor  = conn.cursor()
        
        data        = frame.data
        timeStamp   = frame.timeStamp

        newFrameQuery = "INSERT INTO FRAME (data, timeStamp, recordingId) VALUES('"
        newFrameQuery = newFrameQuery + frame.data
        newFrameQuery = newFrameQuery + "', '"
        newFrameQuery = newFrameQuery + frame.timeStamp
        newFrameQuery = newFrameQuery + "', "
        newFrameQuery = newFrameQuery + str(frame.recordingId)
        newFrameQuery = newFrameQuery + ")"

        cursor.execute(newFrameQuery)
        conn.commit()

        for box in frame.boundingBoxes:
            newBoxQuery = "INSERT INTO BOUNDINGBOX (x, y, width, height, frameId) VALUES(" + str(box[0]) + ", " + str(box[1]) + ", " + str(box[2]) + ", " + str(box[3]) + ", " + str(cursor.lastrowid) + ")"
            
            conn.execute(newBoxQuery)
            conn.commit()

        conn.close()

    def addNewRecording(self):
        conn    = sqlite3.connect(self.databasePath)
        cursor  = conn.cursor()

        newRecordingQuery = "INSERT INTO RECORDING(name) VALUES('untitled')"

        cursor.execute(newRecordingQuery)
        
        recordingId = cursor.lastrowid
        
        conn.commit ()
        conn.close  ()

        return recordingId

    def deleteRecording(self, recordingId):
        conn   = sqlite3.connect(self.databasePath)
        cursor = conn.cursor()

        deleteRecordingQuery = "DELETE FROM RECORDING WHERE id=" + str(recordingId)
        result = cursor.execute(deleteRecordingQuery)
        
        if result.rowcount > 0:
            conn.commit()
            conn.close()
            return True

        conn.commit()
        conn.close()
        return False
       
    def getRecording(self, recordingId):
        recording = Recording()

        conn = sqlite3.connect(self.databasePath)
        cursor = conn.cursor()

        getRecordingQuery = """SELECT r.id, r.name, f.id, f.data, f.timeStamp, b.x, b.y, b.width, b.height
                                FROM FRAME as f
                                INNER JOIN RECORDING as r ON r.id = f.recordingId
                                LEFT JOIN BOUNDINGBOX as b ON f.id = b.frameId
                                WHERE f.recordingId = """ + str(recordingId) + """
                                GROUP BY f.id"""

        rows = cursor.execute(getRecordingQuery)

        if rows.rowcount > 0:
            recording.id    = rows[0][0]
            recording.name  = rows[0][1]

        for row in rows:
            #print(row)
            
            frame = TrackingImage(row[3], row[4])
            
            x       = row[5]
            y       = row[6]
            width   = row[7]
            height  = row[8]

            if x is not None and y is not None and width is not None and height is not None:
                frame.boundingBoxes.append((x, y, width, height))

            recording.frames.append(frame)

        conn.close()

        return recording

    def getRecordingPreviews(self):
        recordingPreviews = []

        conn = sqlite3.connect(self.databasePath)

        cursor = conn.cursor()

        getPreviewQuery = """SELECT r.id, r.name, f.data, MIN(f.timeStamp), COUNT(f.id)
                            FROM RECORDING AS r
                            LEFT JOIN FRAME AS f ON r.id = f.recordingId
                            GROUP BY r.id"""

        rows  = cursor.execute(getPreviewQuery)

        for row in rows:
            recording = Recording(row[0], row[1])
            
            firstFrame = TrackingImage(row[2], row[3])
            recording.addFrame(firstFrame)
            
            recording.runLength = row[4]
            
            recordingPreviews.append(recording)

        conn.close()

        return recordingPreviews
