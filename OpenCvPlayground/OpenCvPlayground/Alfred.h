#pragma once

#include "ThreadPool.h"

#include <queue>
#include <functional>

class Eyes;
class VideoSocket;

class Alfred final
{
public:
	Alfred();
	~Alfred();

	void wakeUp();
	void sleep();

	void postAsync	(const std::function<void()>& f);
	void postMain	(const std::function<void()>& f);

	std::shared_ptr<Eyes> getEyes() const;

private:
	void messageLoop();

	std::queue<std::function<void()>> functionQueue;
	Threading::ThreadPool threadPool;

	std::shared_ptr<Eyes> eyes;
	
	std::unique_ptr<VideoSocket>	videoSocket;

	bool awake;
};