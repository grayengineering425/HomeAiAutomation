#include "ThreadPool.h"
#include "WorkerThread.h"

using namespace Threading;

ThreadPool::ThreadPool(size_t numThreads) :
		isDead		(false		)
	,	threads		(numThreads	)
{
}

ThreadPool::~ThreadPool()
{
	isDead = true;
	cv.notify_all();

	for (auto& thread : threads) { if (thread.joinable()) thread.join(); }
}

void ThreadPool::start()
{
	isDead = false;

	for (size_t i = 0; i < threads.size(); ++i) threads[i] = std::thread(WorkerThread(*this));
}

void ThreadPool::stop()
{
	isDead = true;
	cv.notify_all();

	for (auto& thread : threads) { if (thread.joinable()) thread.join(); }
}

void ThreadPool::addTaskUI(std::function<void()> f)
{
	if (f) f();
}

bool ThreadPool::poolEmpty()
{
	std::lock_guard<std::mutex> lock(mutex);
	return taskPool.empty();
}

std::function<void()> ThreadPool::getTask()
{
	std::lock_guard<std::mutex> lock(mutex);

	if (!taskPool.empty())
	{
		auto task = taskPool.front();
		taskPool.pop();

		return task;
	}

	return nullptr;
}

bool ThreadPool::dead()
{
	return isDead;
}