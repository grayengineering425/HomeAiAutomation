#pragma once
#include "Thread.h"

#include <string>

#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

class Eyes;
class Scheduler;
class Frame;

class FrameSocket
{
public:
	FrameSocket (Scheduler& scheduler);
	~FrameSocket();

	void onNewFrame(const std::shared_ptr<Frame>& frame);

private:
	void listen();
	void serviceNewConnection(boost::asio::ip::tcp::socket& socket);

private:
	Thread			listenThread;
	std::string		ipAddress;
	unsigned short	port;
	bool			connectionAlive;

	std::shared_ptr<boost::beast::websocket::stream<boost::asio::ip::tcp::socket>> connection;
};