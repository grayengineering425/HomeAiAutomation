#pragma once
#include <queue>
#include <functional>

class Scheduler final
{
public:
	Scheduler();
	~Scheduler();

	void wakeUp();
	void sleep ();

	void postMain(const std::function<void()>& f);

private:
	void messageLoop();

private:
	std::queue<std::function<void()>> functionQueue;

	bool awake;
};