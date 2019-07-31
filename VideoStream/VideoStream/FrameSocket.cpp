#pragma once
#include "FrameSocket.h"
#include "Eyes.h"
#include "Scheduler.h"
#include "Thread.h"
#include "Utility.h"
#include "Frame.h"

#include <iostream>

namespace beast		= boost::beast;
namespace http		= beast::http;
namespace websocket = beast::websocket;
namespace net		= boost::asio;

using tcp = boost::asio::ip::tcp;

FrameSocket::FrameSocket(Scheduler& scheduler)
	:	listenThread	(scheduler	)
	,	ipAddress		("127.0.0.1")
	,	port			(9300		)
	,	connectionAlive	(true		)
{
	listenThread.executeAsync([this]
	{
		listen();
	});
}

FrameSocket::~FrameSocket()
{
	connectionAlive = false;
}

void FrameSocket::onNewFrame(const std::shared_ptr<Frame>& frame)
{
	std::wstring wjson = Utility::convertToJsonString(frame);
	auto json = std::string(wjson.begin(), wjson.end());
	

	try
	{
		if (!connection) return;
		connection->write(boost::asio::buffer(json.data(), json.size()));
	}

	catch (beast::system_error const& se)
	{
		// This indicates that the session was closed
		if (se.code() != websocket::error::closed) std::cout << "Error: " << se.code().message() << std::endl;
	}
	catch (std::exception const& e)
	{
		std::cout << "Error: " << e.what() << std::endl;
	}
}

void FrameSocket::listen()
{
	auto const address = net::ip::make_address(ipAddress);

	net::io_context ioc{ 1 };

	tcp::acceptor acceptor{ ioc,{ address, port } };

	while (connectionAlive)
	{
		tcp::socket socket = tcp::socket(ioc);
		acceptor.accept(socket);

		std::thread([this, s = std::move(socket)]() mutable
		{
			serviceNewConnection(s);
		}).detach();
	}
}

void FrameSocket::serviceNewConnection(tcp::socket& socket)
{
	try
	{
		if (auto ws = std::make_shared<websocket::stream<tcp::socket>>(std::move(socket)))
		{
			ws->set_option(websocket::stream_base::decorator(
				[](websocket::response_type& res)
			{
				res.set(http::field::server,
					std::string(BOOST_BEAST_VERSION_STRING) +
					" websocket-server-sync");
			}));

			ws->accept();

			connection = ws;
		}
	}

	catch (beast::system_error const& se)
	{
		// This indicates that the session was closed
		if (se.code() != websocket::error::closed) std::cout << "Error: " << se.code().message() << std::endl;
	}
	catch (std::exception const& e)
	{
		std::cout << "Error: " << e.what() << std::endl;
	}
}