#pragma once
#include <memory>
#include <string>
#include <vector>

class IWebcam;
class FacialRecognitionModel;
class FaceTrackingModel;
class Alfred;
class InferImage;
class RestConnection;

class Eyes
{
public:
	Eyes(Alfred& alfred);
	~Eyes();

	void open();
	void close();

	void inferLatestFrame	(const std::shared_ptr<InferImage>& frame);
	void showLatestFrame	(const std::shared_ptr<InferImage>& frame);

	bool areOpen() const;
	std::shared_ptr<InferImage> getLastProcessed();

private:
	void populateFriends();
	bool isFriend(std::vector<float>& encoding);
	
	void postFrame(const std::shared_ptr<InferImage>& f);

private:
	Alfred &alfred;

	int faceIndex;

	std::vector<std::vector<float>>			friends;

	std::queue<std::shared_ptr<InferImage>> processedImages;


	std::unique_ptr<IWebcam>				webcam;
	std::unique_ptr<FaceTrackingModel>		trackingModel;
	std::unique_ptr<FacialRecognitionModel>	recognitionModel;
	std::unique_ptr<RestConnection>			restConnection;
};