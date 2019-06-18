#pragma once
#define NOMINMAX

#include <string>

#include <tensorflow/core/public/session.h>
#include <tensorflow/core/platform/env.h>
#include <tensorflow/core/protobuf/meta_graph.pb.h>

class InferenceModel
{
public:
	InferenceModel();
	virtual ~InferenceModel();

protected:
	void startSession();
	void startOptimizedSession();

protected:
	std::string graphPath;
	std::string checkpointPath;

	std::string optimizedGraphPath;

	std::string kp;
	std::string inputLayerName;
	std::vector<std::string> outputLayerName;

	tensorflow::Tensor inputTensor;
	tensorflow::Tensor outputTensor;

	tensorflow::MetaGraphDef graphDef;

	tensorflow::Session* session;
};