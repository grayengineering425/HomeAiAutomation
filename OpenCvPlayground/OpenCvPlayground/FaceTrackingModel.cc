#include "FaceTrackingModel.h"
#include "InferImage.h"

#include <tensorflow/core/public/session.h>
#include <tensorflow/core/platform/env.h>
#include <tensorflow/core/protobuf/meta_graph.pb.h>

#include <stdlib.h>

using namespace tensorflow;

FaceTrackingModel::FaceTrackingModel()
{
	graphPath			= "C:/users/graye/Desktop/new_resnet/yolo.ckpt.meta";
	checkpointPath		= "C:/users/graye/Desktop/new_resnet/yolo.ckpt";
	optimizedGraphPath	= "C:/OpenCvPlayground/OpenCvPlayground/yolo_output_model/yolo_output_graph.pb";
	kp					= "kp";
	inputLayerName		= "input_image:0";				 
	outputLayerName		= { "training_vars/final_output:0" };

	startOptimizedSession();
}

FaceTrackingModel::~FaceTrackingModel()
{
}

void FaceTrackingModel::inferImage(const std::shared_ptr<InferImage> image)
{
	if (!session || !image) return;

	int dims = image->getDimensions();
	Tensor inputImage (DT_FLOAT, TensorShape { 1, dims, dims, 3 });

	auto imageData = image->getData();
	imageData.convertTo(imageData, CV_32FC3);

	if (imageData.data) memcpy(const_cast<char*>(inputImage.tensor_data().data()), (imageData.data), dims * dims * 3 * sizeof(float));

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

	//std::cout << outputs[0].DebugString() << std::endl;

	auto mappedOut = outputs[0].tensor<float, 4>();
	image->resize(448, 448);
	for (int y=0; y<7; ++y)
	for (int x=0; x<7; ++x)
	{
		if(mappedOut(0, x, y, 5) > mappedOut(0, x, y, 6) && mappedOut(0, x, y, 0) > 0.9)
		{
			Box::Point centers(mappedOut(0, x, y, 1), mappedOut(0, x, y, 2));
			double width  = mappedOut(0, x, y, 3);
			double height = mappedOut(0, x, y, 4);

			Box box(centers, width, height, x, y);
			image->addBox(box);
		}
	}
}
