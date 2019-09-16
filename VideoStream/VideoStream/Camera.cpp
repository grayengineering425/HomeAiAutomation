#include "Camera.h"
#include "Frame.h"

#include <filesystem>

ICamera::ICamera () = default;
ICamera::~ICamera() = default;

bool ICamera::isActive() const { return active; }


//-------------------------------------------------------------//


Camera::Camera(int cameraIndex, std::string name)
	: ICamera	()
	, windowName(name)
	, cap		(0)
{
	dWidth  = cap.get(cv::CAP_PROP_FRAME_WIDTH );
	dHeight = cap.get(cv::CAP_PROP_FRAME_HEIGHT);

	cv::namedWindow(windowName);
}

Camera::~Camera() = default;

void Camera::startCamera()
{
	active = true;

	while (active)
	{
		cv::Mat frame;

		if (!cap.read(frame))
		{
			std::cout << "Camera disconnected!\n";
			continue;
		}

		{
			std::lock_guard<std::mutex> guard(mutex);
			
			if (eventNewFrame) eventNewFrame(std::make_shared<Frame>(frame));
		}
	}
}

void Camera::stopCamera()
{
	active = false;
}


//---------------------------------------------------------------------------------------------


CameraSimulator::CameraSimulator()
	: ICamera		()
	, directoryPath	(L"C:/users/graye/Pictures/jre")
	, currentIndex	(0)
{
	loadFrames();
}

CameraSimulator::~CameraSimulator() = default;

void CameraSimulator::startCamera()
{
	active = true;
	if (frames.empty()) return;

	while (active)
	{
		auto frame = frames[currentIndex++];
		if (currentIndex >= frames.size()) currentIndex = 0;

		if (eventNewFrame) eventNewFrame(frame);
		
		std::this_thread::sleep_for(std::chrono::milliseconds(60));
	}
}

void CameraSimulator::stopCamera()
{
	active = false;
}

void CameraSimulator::loadFrames()
{
	std::experimental::filesystem::directory_iterator it(directoryPath);

	for (const auto& dir : it)
	{
		if (std::experimental::filesystem::exists(dir))
		{
			std::experimental::filesystem::path p(dir);

			auto loadedImage = cv::imread(p.string());

			frames.emplace_back(std::make_shared<Frame>(loadedImage));
		}
	}
}
