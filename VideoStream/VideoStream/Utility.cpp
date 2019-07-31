#define _NO_ASYNCRTIMP

#include "Utility.h"
#include "Frame.h"

#include <cpprest/json.h>

namespace json = web::json;

std::wstring Utility::convertToJsonString(const std::shared_ptr<Frame>& image)
{
	auto postData = json::value::object();

	if (!image)	postData;

	auto imageData	= image->getBase64Data();

	std::wstring wImageData = std::wstring(imageData.begin(), imageData.end());

	postData[L"data"		] = json::value::string(wImageData);
	postData[L"timeStamp"	] = json::value::string(L"2019-06-13T20:45:13.1959701+02:00");		//TODO

	return postData.serialize();
}

json::value Utility::convertToJsonObject(const std::shared_ptr<Frame>& image)
{
	auto postData = json::value::object();

	if (!image)	postData;

	auto imageData = image->getBase64Data();

	std::wstring wImageData = std::wstring(imageData.begin(), imageData.end());

	postData[L"data"] = json::value::string(wImageData);
	//postData[L"timeStamp"	] = json::value::string(L"2019-06-13T20:45:13.1959701+02:00");		//TODO

	return postData;
}
