#include "VideoSocket.h"
#include "ThreadPool.h"
#include "InferImage.h"
#include "Alfred.h"
#include "Eyes.h"

#include <iostream>

namespace beast		= boost::beast;
namespace http		= beast::http;
namespace websocket = beast::websocket;
namespace net		= boost::asio;

using tcp  = boost::asio::ip::tcp;

using namespace Threading;

VideoSocket::VideoSocket(ThreadPool& tp, Alfred& a)
	:	ipAddress		("127.0.0.1")
	,	port			(9300		)
	,	threadPool		(tp			)
	,	connectionAlive	(true		)
	,	alfred			(a			)
{
	threadPool.addTaskAsync([this]
	{
		listen();
	});
}

VideoSocket::~VideoSocket()
{
	connectionAlive = false;
}

void VideoSocket::listen()
{
	auto const address = net::ip::make_address(ipAddress);

	net::io_context ioc{ 1 };

	tcp::acceptor acceptor{ ioc,{ address, port } };

	while (connectionAlive)
	{
		tcp::socket socket(ioc);
		acceptor.accept(socket);

		serviceNewConnection(socket);
		//std::thread(&VideoSocket::serviceNewConnection, this, std::move(socket)).detach();
	}
}

void VideoSocket::serviceNewConnection(tcp::socket& socket)
{
	try
	{
		websocket::stream<tcp::socket> ws{ std::move(socket) };

		ws.set_option(websocket::stream_base::decorator(
			[](websocket::response_type& res)
		{
			res.set(http::field::server,
				std::string(BOOST_BEAST_VERSION_STRING) +
				" websocket-server-sync");
		}));

		ws.accept();

		auto eyes = alfred.getEyes();
		if (!eyes) return;

		//loop, convert latest frame to json, same format as python server, then send
		while (true)
		{
			if (auto latestFrame = eyes->getLastProcessed())
			{
				auto json = convertToJson(latestFrame);

				ws.write(boost::asio::buffer(json.data(), json.size()));
			}
		}
	}

	catch (beast::system_error const& se)
	{
		// This indicates that the session was closed
		if (se.code() != websocket::error::closed)
		std::cout << "Error: " << se.code().message() << std::endl;
	}
	catch (std::exception const& e)
	{
		std::cout << "Error: " << e.what() << std::endl;
	}
}

std::string VideoSocket::convertToJson(std::shared_ptr<InferImage>& image)
{
	if (!image) return "";
	auto data = image->getData();
	
	if (data.empty()) return "";

	std::string json = "{ \"data\": \"";
	json += image->getBase64Data();
	json += "\", ";
	json += "\"boundingBoxes\":[{ \"x\": ";
	json += 
	json += "\"}";

	return json;
}
