#include "WorkerThread.h"
#include "ThreadPool.h"

using namespace Threading;

WorkerThread::WorkerThread	(ThreadPool& _threadPool) :
	threadPool(_threadPool)
{
}

WorkerThread::~WorkerThread() = default;

WorkerThread::WorkerThread (const WorkerThread &&_w) :
	threadPool(_w.threadPool)
{
}

void WorkerThread::operator()()
{
	while (!threadPool.dead())
	{
		std::unique_lock<std::mutex> lock(mutex);
		threadPool.cv.wait(lock, [this]{ return !threadPool.poolEmpty() || threadPool.dead(); });

		auto task = threadPool.getTask();
		if (task) task(); 
	}
}