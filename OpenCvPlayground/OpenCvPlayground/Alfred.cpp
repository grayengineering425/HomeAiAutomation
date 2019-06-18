#include "Alfred.h"
#include "Eyes.h"
#include "VideoSocket.h"
#include "RestConnection.h"

Alfred::Alfred()
	:	threadPool		(10)
	,	eyes			(std::make_unique<Eyes>(*this))
	,	videoSocket		(std::make_unique<VideoSocket>(threadPool, *this))
	,	awake(false)

{
	threadPool.start();
}

Alfred::~Alfred()
{
}

void Alfred::wakeUp()
{
	awake = true;
	if (eyes) eyes->open();

	messageLoop();
}

void Alfred::sleep()
{
	eyes->close();

	awake = false;
}

void Alfred::postAsync(const std::function<void()>& f)
{
	threadPool.addTaskAsync(f);
}

void Alfred::postMain(const std::function<void()>& f)
{
	functionQueue.push(f);
}

std::shared_ptr<Eyes> Alfred::getEyes() const
{
	return eyes;
}

void Alfred::messageLoop()
{
	while(awake)
	{
		if (!functionQueue.empty())
		{
			auto f = functionQueue.front();
			functionQueue.pop();

			if (f) f();
		}
	}
}
