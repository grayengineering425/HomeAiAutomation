#include "Scheduler.h"

Scheduler::Scheduler()
	:	awake(false)
{
}

Scheduler::~Scheduler()
{
}

void Scheduler::wakeUp()
{
	awake = true;

	messageLoop();
}

void Scheduler::sleep()
{
	awake = false;
}

void Scheduler::postMain(const std::function<void()>& f)
{
	functionQueue.push(f);
}

void Scheduler::messageLoop()
{
	while (awake)
	{
		if (!functionQueue.empty())
		{
			auto function = functionQueue.front();
			functionQueue.pop();

			if (function) function();
		}
	}
}
