import enum

from Face import Face

class Relationship(enum.Enum):
        Friend      = 1
        Family      = 2
        Colleague   = 3
        Self        = 4
        NoRelation  = 5

class Friend:
    def __init__(self, id=0, name="", relationship="", data="", encoding="", faceId=0):
        self.id             = id
        self.name           = name
        self.face           = Face(faceId, data, encoding)
        
        self.getRelation(relationship)
    
    def toDict(self):
        friendDict = {
                    'id'            : self.id
                ,   'name'          : self.name
                ,   'relationship'  : self.relationship.name
                ,   'face'          : self.face.toDict()
            }

        return friendDict

    def getRelation(self, relationship):
        if relationship.lower() == "friend":
            self.relationship = Relationship.Friend
        elif relationship.lower() == "family":
            self.relationship = Relationship.Family
        elif relationship.lower() == "colleague":
            self.relationship = Relationship.Colleague
        elif relationship.lower() == "self":
            self.relationship = Relationship.Self
        else:
            self.relationship = Relationship.NoRelation