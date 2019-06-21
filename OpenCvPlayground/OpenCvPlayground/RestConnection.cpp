#define _NO_ASYNCRTIMP


#include "RestConnection.h"
#include "InferImage.h"

#include <cpprest/http_client.h>
#include <cpprest/json.h>

using namespace utility;                    // Common utilities like string conversions
using namespace web;                        // Common features like URIs.
using namespace web::http;                  // Common HTTP functionality
using namespace web::http::client;          // HTTP client features
using namespace concurrency::streams;       // Asynchronous streams
using namespace web::json;					// JSON library

#pragma comment (lib, "crypt32")

RestConnection::RestConnection()
	:	apiString			(L"https://localhost:44357/api/Recording/")
	,	client				(std::make_unique<http_client>(apiString))
	,	currentRecordingId	(-1)
{
}

RestConnection::~RestConnection()
{
}

void RestConnection::postRecording()
{
	if (!client) return;

	auto postData = json::value::object();
	auto response = client->request(methods::POST, L"", postData).get();

	if (response.status_code() == status_codes::Created)
	{
		auto parsedResponse = response.extract_json().get();

		currentRecordingId = parsedResponse[L"id"].as_integer();
	}
}

void RestConnection::postFrame(const std::shared_ptr<InferImage>& image)
{
	if (!client) return;

	auto postData = getFrameJson(image);
	auto response = client->request(methods::POST, std::to_wstring(currentRecordingId) + L"/", postData).get();

	//TODO: how to handle response, also should be using concurrency api?
}

int RestConnection::getId() const
{
	return currentRecordingId;
}

json::value RestConnection::getFrameJson(const std::shared_ptr<InferImage>& image)
{
	auto postData = json::value::object();

	if (!image)	postData;

	auto boxes		= image->getBoxes();
	auto imageData	= image->getBase64Data();

	std::wstring wImageData = std::wstring(imageData.begin(), imageData.end());

	for (int i = 0; i < boxes.size(); ++i)
	{
		auto currentBox = boxes[i];

		postData[L"boundingBoxes"][i][L"height"]	= json::value::number(currentBox.height	);
		postData[L"boundingBoxes"][i][L"width"]		= json::value::number(currentBox.width	);
		postData[L"boundingBoxes"][i][L"y"]			= json::value::number(currentBox.cellX	);
		postData[L"boundingBoxes"][i][L"x"]			= json::value::number(currentBox.cellY	);
	}

	postData[L"data"		] = json::value::string(wImageData);
	postData[L"timeStamp"	] = json::value::string(L"2019-06-13T20:45:13.1959701+02:00");		//TODO

	return postData;
}