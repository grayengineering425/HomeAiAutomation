#pragma once
#include "Thread.h"
#include "Scheduler.h"

Thread::Thread(Scheduler & s)
	:	alive		(true)
	,	scheduler	(s)
	,	thread		(std::thread(&Thread::run, this))
{
}

Thread::~Thread()
{
	alive = false;
	cv.notify_all();

	if (thread.joinable()) thread.join();
}

void Thread::executeUI(const std::function<void()>& f)
{
	scheduler.postMain(f);
}

bool Thread::isAlive()
{
	return alive;
}

void Thread::run()
{
	while(alive)
	{
		std::unique_lock<std::mutex> lock(mutex);
		cv.wait(lock, [this]{ return !functionQueue.empty() || !isAlive(); });

		auto task = functionQueue.front();
		functionQueue.pop();

		if (task) task();
	}
}
