//#pragma once
//#include <thread>
//#include <mutex>
//#include <condition_variable>
//#include <queue>
//
//class Alfred;
//
//class Thread
//{
//public:
//	Thread(Alfred& alfred);
//	~Thread();
//
//	void executeAsync	(std::function<void()>& f);
//	void executeUI		(std::function<void()>& f);
//
//private:
//	void run();
//	bool isAlive();
//
//	Alfred& alfred;
//
//	bool alive;
//	std::queue<std::function<void()>> functionQueue;
//
//	std::thread				thread;
//	std::mutex				mutex;
//	std::condition_variable cv;
//};