#include "Eyes.h"
#include "Scheduler.h"
#include "Frame.h"
#include "Camera.h"
#include "FrameSocket.h"
#include "ConnectionManager.h"

#include <fstream>

Eyes::Eyes(Scheduler& s)
	:	scheduler		(s)
	,	cameraThread	(s)
	,	camera			(std::make_unique<CameraSimulator>())
	,	connections		(std::make_unique<ConnectionManager>(s))
	,	showImages		(false)

{
	if (camera) camera->eventNewFrame = [this](std::shared_ptr<Frame> frame)
	{
		scheduler.postMain([this, frame]
		{
			showLatestFrame(frame);
		});
	};
}

Eyes::~Eyes() = default;

void Eyes::open()
{
	if (!camera) return;

	cameraThread.executeAsync([this]
	{
		camera->startCamera();
	});
}

void Eyes::close()
{
	if (camera) camera->stopCamera();
}

void Eyes::showLatestFrame(const std::shared_ptr<Frame>& frame)
{
	if (!frame) return;

	if (connections) connections->onNewFrame(frame);

	auto data = frame->getData();
	if (data.empty()) return;

	cv::imshow("Camera Feed", data);
	int ascii = cv::waitKey(30);
}

bool Eyes::areOpen() const { return camera && camera->isActive(); }

