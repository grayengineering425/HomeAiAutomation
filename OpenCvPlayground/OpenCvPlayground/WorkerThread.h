#pragma once
#include <mutex>

namespace Threading
{

class ThreadPool;

class WorkerThread
{
public:
	WorkerThread(ThreadPool& _threadPool);
	virtual ~WorkerThread();

	WorkerThread (const WorkerThread&& _w);

	void operator()();

private:
	ThreadPool&	threadPool;

	std::mutex mutex;
};

}