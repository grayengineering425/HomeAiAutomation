#include "WebCam.h"
#include "InferImage.h"

#include <filesystem>

bool IWebcam::isActive() const { return active;	}

WebCam::WebCam(int cameraIndex, std::string name)
	:	IWebcam				()
	,	windowName			(name	)
	,	cap					(0		)
{
	dWidth	= cap.get(cv::CAP_PROP_FRAME_WIDTH );
	dHeight = cap.get(cv::CAP_PROP_FRAME_HEIGHT);
	cv::namedWindow(windowName);
}

WebCam::~WebCam() = default;

void WebCam::startCamera()
{
	active = true;

	while(active)
	{
		cv::Mat frame;
		if (!cap.read(frame))
		{
			std::cout << "Camera disconnected!\n";
			continue;
		}
		
		{
		std::lock_guard<std::mutex> guard(mutex);
		if (eventNewFrame) eventNewFrame(std::make_shared<InferImage>(frame));
		}
	}
}

void WebCam::stopCamera()
{
	active = false;
}

std::string WebCam::getWindowName	() const { return windowName; }




//---------------------------------------------------------------------------------------------

WebcamSimulator::WebcamSimulator()
	:	IWebcam			()
	,	directoryPath	(L"C:/users/graye/Pictures/jre")
	,	currentIndex	(0)
{
	loadFrames();
}

WebcamSimulator::~WebcamSimulator()
{
}

void WebcamSimulator::startCamera()
{
	active = true;
	if (frames.empty()) return;

	while(active)
	{
		auto frame = frames[currentIndex++];
		if (eventNewFrame) eventNewFrame(frame);

		if (currentIndex == frames.size()) currentIndex = 0;
		std::this_thread::sleep_for(std::chrono::milliseconds(30));
	}
}

void WebcamSimulator::stopCamera()
{
}

void WebcamSimulator::loadFrames()
{
	std::experimental::filesystem::directory_iterator it(directoryPath);

	for (const auto& dir: it)
	{
		if (std::experimental::filesystem::exists(dir))
		{
			std::experimental::filesystem::path p(dir);
			frames.emplace_back(std::make_shared<InferImage>(cv::imread(p.string())));
		}
	}
}
