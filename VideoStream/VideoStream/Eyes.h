#pragma once
#include "Thread.h"

#include <memory>
#include <string>
#include <vector>

class ICamera;
class Scheduler;
class Frame;
class ConnectionManager;

class Eyes
{
public:
	explicit Eyes(Scheduler& scheduler);
	~Eyes();

	void open ();
	void close();
	void showLatestFrame(const std::shared_ptr<Frame>& frame);

	bool					areOpen			() const;

private:
	Scheduler&	scheduler;
	Thread		cameraThread;

	std::unique_ptr<ICamera				> camera;
	std::unique_ptr<ConnectionManager	> connections;

	//change to vector, shift left if we are above a certain size
	
	bool showImages;
};