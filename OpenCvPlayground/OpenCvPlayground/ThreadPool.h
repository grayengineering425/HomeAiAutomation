#pragma once

#include <queue>
#include <mutex>
#include <functional>
#include <future>
#include <thread>

namespace Threading
{

class WorkerThread;

class ThreadPool
{

public:
	explicit ThreadPool(size_t numThreads);
	virtual ~ThreadPool();

	ThreadPool(const ThreadPool&			) = delete;
	ThreadPool(ThreadPool&&					) = delete;
	ThreadPool & operator=(const ThreadPool&) = delete;
	ThreadPool & operator=(ThreadPool&&		) = delete;

	friend WorkerThread;

	void start	();
	void stop	();

	template <class F, class... Args>
	auto addTaskAsync(F&& f, Args&&... args) -> std::future<decltype(f(args...))>;

	void addTaskUI(std::function<void()> f);

private:
	bool					poolEmpty	();
	std::function<void()>	getTask		();
	bool					dead		();

private:
	bool										isDead;
	mutable std::mutex							mutex;
	std::vector<std::thread>					threads;
	mutable std::queue<std::function<void()>>	taskPool;
	mutable std::condition_variable				cv;
};

template <class F, class... Args>
inline auto ThreadPool::addTaskAsync(F&& f, Args&&... args) -> std::future<decltype(f(args...))>
{
	std::function<decltype(f(args...))()> boundFunction = std::bind(std::forward<F>(f), std::forward<Args>(args)...);
	auto task_ptr = std::make_shared<std::packaged_task<decltype(f(args...))()>>(boundFunction);

	std::function<void()> functionWrapper = [task_ptr]()
	{
		(*task_ptr)();
	};

	std::lock_guard<std::mutex> guard(mutex);
	
	taskPool.push(functionWrapper);
	cv.notify_one();

	return task_ptr->get_future();
}

}