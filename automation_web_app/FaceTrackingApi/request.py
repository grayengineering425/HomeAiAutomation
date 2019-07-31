import requests
from imageio import imread
import base64

url         = "http://localhost:5000/Recording"
fileName    = "C:/Users/310262408/Pictures/jre/face6.png"

encodedString = ""

with open(fileName, "rb") as image_file:
    encodedString = base64.b64encode(image_file.read()).decode('UTF-8')

#response = requests.post(url)#, json={"data": encodedString, "timeStamp": "12345"})
#json = response.json()

#id = json[u"recording"]["id"]

#print(response.status_code  )
#print(id                    )

url_frame_post = "http://localhost:5000/RecordingPreviews"

frameJson = {"data": encodedString }
frameResponse = requests.get(url_frame_post)

json = frameResponse.json()

print(json)
print(frameResponse.status_code)
