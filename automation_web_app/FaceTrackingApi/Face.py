import enum

class Face:
    def __init__(self, id=0, data="", encoding=""):
        self.id         = id
        self.data       = data
        self.encoding   = []

        #self.parseEncoding(encoding)

    def toDict(self):
        friendDict = {
                    'id'        : self.id
                ,   'data'      : self.data
                ,   'encoding'  : self.encoding
            }

        return friendDict

    def parseEncoding(self, encoding):
        self.encoding.clear()

        splitEncoding = encoding.split(',')
        
        for value in splitEncoding:
            self.encoding.append(float(value))