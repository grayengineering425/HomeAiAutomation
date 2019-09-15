class Friend: 
    def __init__(self, id=0, name="", encoding="", data="", known=False):
        self.id         = id
        self.name       = name
        self.encoding   = self.parseEncoding(encoding)
        self.data       = self.readData(data)
        self.known      = known

    def toDict(self):
        friendDict = {
                    'id'        : self.id
                ,   'name'      : self.name
                ,   'encoding'  : self.encoding
                ,   'data'      : self.data
                ,   'known'     : self.known
            }

        return friendDict

    def parseEncoding(self, encoding):
        self.encoding.clear()

        splitEncoding = encoding.split(',')
        
        for value in splitEncoding:
            self.encoding.append(float(value))

    def readData(self, data):
        #TODO
        return ""