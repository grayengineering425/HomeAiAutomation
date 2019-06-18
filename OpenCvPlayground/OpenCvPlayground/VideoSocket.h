#pragma once
#include <string>

#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

namespace Threading
{
	class ThreadPool;
};

class InferImage;
class Alfred;

class VideoSocket
{
public:
	VideoSocket(Threading::ThreadPool& threadPool, Alfred& alfred);
	~VideoSocket();

private:
	void listen();
	void serviceNewConnection(boost::asio::ip::tcp::socket& socket);
	
	std::string convertToJson(std::shared_ptr<InferImage>& image);

private:
	std::string		ipAddress;
	unsigned short	port;
	bool			connectionAlive;
	
	Alfred&					alfred;
	Threading::ThreadPool&	threadPool;
};