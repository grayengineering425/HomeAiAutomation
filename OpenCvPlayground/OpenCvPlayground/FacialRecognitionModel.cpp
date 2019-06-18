#include "FacialRecognitionModel.h"
#include <opencv2/opencv.hpp>

#include <fstream>

using namespace tensorflow;

FacialRecognitionModel::FacialRecognitionModel()
{
	graphPath			= "C:/users/graye/Desktop/new_resnet/triplet_mode.ckpt.meta";
	checkpointPath		= "C:/users/graye/Desktop/new_resnet/triplet_mode.ckpt";
	optimizedGraphPath	= "";
	kp					= "kp:0";
	inputLayerName		= "input_node:0";				 
	outputLayerName		= { "fully_connected/BiasAdd:0" };

	startSession();
}

FacialRecognitionModel::~FacialRecognitionModel()
{
}

void FacialRecognitionModel::inferImage(cv::Mat& image, std::vector<float>& encoding)
{
	if (!session || image.empty()) return;

	Tensor inputImage (DT_FLOAT, TensorShape { 1, 200 * 180 * 3 });

	image.convertTo(image, CV_32FC3);
	auto flatImage = image.reshape(0, 1);

	flatImage = flatImage / 255;

	if (image.data) memcpy(const_cast<char*>(inputImage.tensor_data().data()), (flatImage.data), 200 * 180 * 3 * sizeof(float));

	std::vector<Tensor> outputs;

	Tensor kpFill(DT_BOOL, TensorShape());
	kpFill.scalar<bool>()() = false;

	{
	auto status = session->Run({{ inputLayerName, inputImage }, {kp, kpFill}}, outputLayerName, {}, &outputs);
	if (!status.ok())
	{
		return;
	}
	}

	auto mappedOut = outputs[0].tensor<float, 2>();

	for (int i=0; i<128; ++i) encoding.emplace_back(mappedOut(0, i));

	//std::ofstream logFile;
	//std::string fileName = "encoding.txt";

	//logFile.open(fileName);

	//if (logFile.is_open())
	//{
	//	for (int i=0; i<128; ++i) logFile << std::to_string(mappedOut(0, i)) << " ";
	//	logFile.close();
	//}
}
