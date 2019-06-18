#pragma once
#include <string>
#include <memory>

class InferImage;

namespace web { namespace http { namespace client	{ class http_client;	} } }
namespace web { namespace json						{ class value;			} }

class RestConnection
{
public:
	RestConnection	();
	~RestConnection	();

	void	postRecording	();
	void	postFrame		(const std::shared_ptr<InferImage>& image);

	int getId() const;

private:
	web::json::value getFrameJson(const std::shared_ptr<InferImage>& image);

private:
	std::wstring									apiString;
	int												currentRecordingId;

	std::unique_ptr<web::http::client::http_client> client;


};