#pragma once
#include <memory>
#include <string>

class Frame;

namespace web { namespace json { class value; } }

class Utility
{
public:
	static std::wstring		convertToJsonString(const std::shared_ptr<Frame>& image);
	static web::json::value	convertToJsonObject(const std::shared_ptr<Frame>& image);
};
