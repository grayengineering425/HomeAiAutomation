#pragma once
#include <iostream>
#include <string>
#include <stack>
#include <opencv2/opencv.hpp>
#include <condition_variable>

class InferImage;

class IWebcam
{
public:
	IWebcam()			= default;
	virtual~IWebcam()	= default;

	virtual void startCamera() = 0;
	virtual void stopCamera	() = 0;

	bool isActive() const;

	std::function<void(const std::shared_ptr<InferImage>&)> eventNewFrame;

protected:
	double	dWidth;
	double	dHeight;
	bool	active;
};

class WebCam : public IWebcam
{
public:
	WebCam(int cameraIndex = 0, std::string name = "test");
	virtual ~WebCam();

	void startCamera() override;
	void stopCamera	() override;

	std::string					getWindowName	() const;

private:
	cv::VideoCapture			cap;
	std::string					windowName;
	
	mutable std::mutex			mutex;
};

class WebcamSimulator : public IWebcam
{
public:
	WebcamSimulator();
	virtual ~WebcamSimulator();

	void startCamera() override;
	void stopCamera	() override;

private:
	void loadFrames();

private:
	std::wstring directoryPath;
	std::vector<std::shared_ptr<InferImage>> frames;

	size_t currentIndex;
};