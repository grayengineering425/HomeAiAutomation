#pragma once
#include <memory>

class FrameSocket;
class Frame;
class Scheduler;
class RestConnection;

class ConnectionManager
{
public:
	explicit ConnectionManager(Scheduler& scheduler);
	~ConnectionManager();

	void onNewFrame(const std::shared_ptr<Frame>& frame);

private:
	std::unique_ptr<RestConnection> rest;
	std::unique_ptr<FrameSocket>	socket;
};