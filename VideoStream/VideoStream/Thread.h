#pragma once
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <future>

class Scheduler;

class Thread
{
public:
	explicit Thread(Scheduler& scheduler);
	~Thread();

	template <class F, class... Args>
	auto executeAsync(F&& f, Args&&... args) -> std::future<decltype(f(args...))>;

	void executeUI		(const std::function<void()>& f);

private:
	void run	();
	bool isAlive();
private:
	Scheduler  &scheduler;
	bool		alive;
	
	std::mutex				mutex;
	std::condition_variable cv;
	std::thread				thread;

	std::queue<std::function<void()>> functionQueue;
};

template <class F, class... Args>
inline auto Thread::executeAsync(F&& f, Args&&... args) -> std::future<decltype(f(args...))>
{
	std::function<decltype(f(args...))()> boundFunction = std::bind(std::forward<F>(f), std::forward<Args>(args)...);
	auto task_ptr = std::make_shared<std::packaged_task<decltype(f(args...))()>>(boundFunction);

	std::function<void()> functionWrapper = [task_ptr]()
	{
		(*task_ptr)();
	};

	std::lock_guard<std::mutex> guard(mutex);

	functionQueue.push(functionWrapper);
	cv.notify_one();

	return task_ptr->get_future();
}