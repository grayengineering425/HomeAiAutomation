#include "InferenceModel.h"

#include "tensorflow/core/graph/default_device.h"


using namespace tensorflow;

InferenceModel::InferenceModel()
	:	graphPath			("C:/Users/310262408/Desktop/yolo_ckpt/res_net/yolo.ckpt.meta"					)
	,	checkpointPath		("C:/Users/310262408/Desktop/yolo_ckpt/res_net/yolo.ckpt"						)
	,	optimizedGraphPath	("C:/OpenCvPlayground/OpenCvPlayground/yolo_output_model/yolo_output_graph.pb"	)
	,	kp					("kp"																			)
	,	inputLayerName		("input_image:0"			 													)
	,	outputLayerName		({ "training_vars/final_output:0" }												)
{
}

InferenceModel::~InferenceModel()
{
	delete session;
}

void InferenceModel::startSession()
{
	Status status;
	tensorflow::SessionOptions options;

	status = tensorflow::NewSession(options, &session);

	if (!status.ok())
	{
		return;
	}

	status = ReadBinaryProto(Env::Default(), graphPath, &graphDef);
	if (!status.ok())
	{
		return;
	}

	status = session->Create(graphDef.graph_def());
	if (!status.ok())
	{
		return;
	}


	Tensor checkpointPathTensor(DT_STRING, TensorShape());
	checkpointPathTensor.scalar<std::string>()() = checkpointPath;
	status = session->Run(
        {
			{ graphDef.saver_def().filename_tensor_name(), checkpointPathTensor },
		},
        {},
        { graphDef.saver_def().restore_op_name()},
        nullptr);

	if (!status.ok())
	{
		return;
	}
}

void InferenceModel::startOptimizedSession()
{
	auto options = tensorflow::SessionOptions();
	//options.config.allow_soft_placement = true;

	tensorflow::Status status = tensorflow::NewSession(options, &session);
	if (!status.ok()) {
	       std::cout << status.ToString() << "\n";
	}
	
	tensorflow::GraphDef graph_def;

	graph::SetDefaultDevice("/device:GPU:0", &graph_def);

	status = ReadBinaryProto(tensorflow::Env::Default(), optimizedGraphPath, &graph_def);
	if (!status.ok()) {
	       std::cout << status.ToString() << "\n";
	}


	// Add the graph to the session
	status = session->Create(graph_def);
	
	if (!status.ok())
	{
		std::cout << status.ToString() << "\n";
	}
}
