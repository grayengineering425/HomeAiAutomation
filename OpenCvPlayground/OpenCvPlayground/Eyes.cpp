#include "Alfred.h"
#include "Eyes.h"
#include "FaceTrackingModel.h"
#include "FacialRecognitionModel.h"
#include "InferImage.h"
#include "WebCam.h"
#include "RestConnection.h"

#include <fstream>

Eyes::Eyes(Alfred& a)
	:	alfred			(a)
	,	webcam			(std::make_unique<WebcamSimulator>()		)
	,	trackingModel	(std::make_unique<FaceTrackingModel>()		)
	,	recognitionModel(std::make_unique<FacialRecognitionModel>()	)
	,	restConnection	(std::make_unique<RestConnection>()			)

{
	populateFriends();
	faceIndex = 0;

	if (webcam) webcam->eventNewFrame = [this](const std::shared_ptr<InferImage>& f) { 
		alfred.postMain([this, f]
		{
			inferLatestFrame(f);
			postFrame		(f);
		});
	};
}

Eyes::~Eyes() = default;

void Eyes::open()
{
	if (!webcam) return;

	alfred.postAsync([this]
	{
		webcam->startCamera();
	});
}

void Eyes::close()
{
	if (webcam) webcam->stopCamera();
}

void Eyes::inferLatestFrame(const std::shared_ptr<InferImage>& frame)
{
	if (!webcam || !frame || frame->getData().empty()) return;

	trackingModel->inferImage(frame);
	
	showLatestFrame(frame);
}

void Eyes::showLatestFrame(const std::shared_ptr<InferImage>& frame)
{
	if (!frame) return;

	//cv::resize(data, data, cv::Size(448, 448));

	frame->resize(720, 480);
	processedImages.push(frame);

	auto data = frame->getData();
	if (data.empty()) return;

	cv::imshow("Camera Feed", data);
	int ascii = cv::waitKey(1);
		
	//if (ascii == 116) alfred.sleep();
}

void Eyes::populateFriends()
{
	std::string fileName = "encoding.txt";
	std::ifstream eFile;

	eFile.open(fileName);

	std::vector<float> encoding;

	if (eFile.is_open())
	{
		float e;
		while (eFile >> e)
		{
			encoding.emplace_back(e);
		}
		eFile.close();
	}

	if (encoding.size() == 128) friends.emplace_back(encoding);
}

bool Eyes::isFriend(std::vector<float>& encoding)
{
	double sos = 0.0;

	for (const auto& fwend: friends)
	{
		for (int i=0; i < 128; ++i) sos += std::pow(fwend[i] - encoding[i], 2);
	}

	std::cout << sos << "\n";
	return sos < 2.0;
}

void Eyes::postFrame(const std::shared_ptr<InferImage>& f)
{
	if (!restConnection) return;
	if (restConnection->getId() == -1) restConnection->postRecording();
	if (restConnection->getId() == -1) return;

	restConnection->postFrame(f);
}

std::shared_ptr<InferImage> Eyes::getLastProcessed()
{
	if (processedImages.empty()) return nullptr;

	auto latest = processedImages.front();
	processedImages.pop();

	return latest;
}


bool Eyes::areOpen() const { return webcam && webcam->isActive(); }

