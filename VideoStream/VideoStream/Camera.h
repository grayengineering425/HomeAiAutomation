#pragma once
#include <iostream>
#include <string>
#include <stack>
#include <opencv2/opencv.hpp>

class Frame;

class ICamera
{
public:
	ICamera();
	virtual ~ICamera();

	virtual void startCamera() = 0;
	virtual void stopCamera () = 0;

	bool isActive() const;

	std::function<void(std::shared_ptr<Frame>)> eventNewFrame;

protected:
	double	dWidth;
	double	dHeight;
	bool	active;
};

class Camera : public ICamera
{
public:
	Camera(int cameraIndex = 0, std::string name = "test");
	virtual ~Camera();

	void					startCamera		() override;
	void					stopCamera		() override;

private:
	cv::VideoCapture			cap;
	std::string					windowName;

	mutable std::mutex					mutex;
};

class CameraSimulator : public ICamera
{
public:
	CameraSimulator();
	virtual ~CameraSimulator();

	void startCamera() override;
	void stopCamera () override;

private:
	void loadFrames();

private:
	std::wstring directoryPath;
	std::vector<std::shared_ptr<Frame>> frames;

	size_t currentIndex;
};