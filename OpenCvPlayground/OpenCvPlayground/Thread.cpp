//#include "Thread.h"
//#include "Alfred.h"
//
//
//Thread::Thread(Alfred & a)
//	:	alfred	(a)
//	,	alive	(true)
//	,	thread	(std::thread(&Thread::run, this))
//{
//}
//
//Thread::~Thread()
//{
//	alive = false;
//	cv.notify_all();
//
//	if (thread.joinable()) thread.join();
//}
//
//void Thread::executeAsync(std::function<void()>& f)
//{
//	functionQueue.push(f);
//	cv.notify_all();
//}
//
//void Thread::executeUI(std::function<void()>& f)
//{
//	alfred.postMain(f);
//}
//
//bool Thread::isAlive()
//{
//	return alive;
//}
//
//void Thread::run()
//{
//	while(alive)
//	{
//		std::unique_lock<std::mutex> lock(mutex);
//		cv.wait(lock, [this]{ return !functionQueue.empty() || !isAlive(); });
//
//		auto task = functionQueue.front();
//		functionQueue.pop();
//
//		if (task) task();
//	}
//}
