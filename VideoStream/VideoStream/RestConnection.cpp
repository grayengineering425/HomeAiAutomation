#define _NO_ASYNCRTIMP

#include "RestConnection.h"
#include "Frame.h"
#include "Utility.h"

#include <cpprest/http_client.h>
#include <cpprest/json.h>

using namespace web::http;                  // Common HTTP functionality
using namespace web::http::client;          // HTTP client features

#pragma comment (lib, "crypt32")

RestConnection::RestConnection()
	: apiString	(L"http://127.0.0.1:5000/")
	, client	(std::make_unique<http_client>(apiString))
{
}

RestConnection::~RestConnection() {};

void RestConnection::onNewFrame(const std::shared_ptr<Frame>& image)
{
	if (!client) return;

	try
	{
		auto postData = Utility::convertToJsonObject(image);
		auto response = client->request(methods::POST, L"/Frame", postData).get();
	}
	catch (std::exception&)
	{
		//TODO: Handle exception
		std::cout << "Could not send frame to REST server\n";
	}

	//TODO: how to handle response, also should be using concurrency api?
}