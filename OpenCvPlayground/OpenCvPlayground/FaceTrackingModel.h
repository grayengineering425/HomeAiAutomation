#pragma once

#include "InferenceModel.h"

#include <mutex>

class InferImage;

class FaceTrackingModel : public InferenceModel
{
public:
	FaceTrackingModel();
	~FaceTrackingModel();

	void inferImage(std::shared_ptr<InferImage> image);

private:
	//void parseNetworkOutput(std::shared_ptr<InferImage> image, std::vector<tensorflow::Tensor>& output);
};