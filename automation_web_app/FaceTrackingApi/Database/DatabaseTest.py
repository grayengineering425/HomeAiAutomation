from Database       import SqlDatabase
from TrackingImage import TrackingImage

import sys
sys.path.append('../Recording')

from Recording import Recording

if __name__ == '__main__':
    database = SqlDatabase()

    database.deleteRecording(4)
