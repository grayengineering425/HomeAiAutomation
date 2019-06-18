#pragma once

#include "InferenceModel.h"

namespace cv
{
	class Mat;
}

class FacialRecognitionModel : public InferenceModel
{
public:
	FacialRecognitionModel();
	~FacialRecognitionModel();

	void inferImage(cv::Mat& image, std::vector<float>& encoding);
};