#pragma once
#include <string>
#include <memory>

class Frame;

namespace web { namespace http { namespace client { class http_client; } } }

class RestConnection
{
public:
	RestConnection();
	~RestConnection();

	void onNewFrame(const std::shared_ptr<Frame>& image);

private:
	std::wstring apiString;

	std::unique_ptr<web::http::client::http_client> client;
};