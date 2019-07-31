import numpy as np
import base64
import io
import cv2

from imageio import imread

class TrackingImage : 
    def __init__(self, data, timeStamp):
        self.data           = data
        self.timeStamp      = timeStamp
        self.recordingId    = 0
        self.boundingBoxes  = []

    def convertData(self):
        img = imread(io.BytesIO(base64.b64decode(self.data)))
        return img

    def getEncodingInformation(self, encoding):
        pc      = encoding[...,   :1]
        boxes   = encoding[...,  1:5]
        softmax = encoding[..., -2:7]
        
        return pc, boxes, softmax

    def parseEncoding(self, encoding):
        pc, boxes, softmax = self.getEncodingInformation(encoding)

        for i in range(pc.shape[0]):
            for j in range(pc.shape[1]):
                cur_pc      = pc     [i, j]
                cur_box     = boxes  [i, j]
                cur_softmax = softmax[i, j]
                
                p = np.argmax(cur_softmax)
                if p == 0:
                    if cur_pc > 0.9:
                        x      = 0 if cur_box[0] < 0 else int(cur_box[0] * 64.0 + (i * 64.0))
                        y      = 0 if cur_box[1] < 0 else int(cur_box[1] * 64.0 + (j * 64.0))
                        width  = 0 if cur_box[2] < 0 else int(cur_box[2] * 448.0)
                        height = 0 if cur_box[3] < 0 else int(cur_box[3] * 448.0)

                        print(str(x) + ", " + str(y) + ", " + str(width) + ", " + str(height))

                        self.boundingBoxes.append((x, y, width, height))

    def toDict(self):
        frameDict = {
                        'data'          : self.data
                    ,   'timeStamp'     : self.timeStamp
                    ,   'boundingBoxes' : []
                }

        for box in self.boundingBoxes:
            frameDict['boundingBoxes'].append({
                    'x'     : box[0]
                ,   'y'     : box[1]
                ,   'width' : box[2]
                ,   'height': box[3]
            })

        return frameDict

