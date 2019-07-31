#pragma once
#include <vector>
#include <opencv2/opencv.hpp>

class Frame
{
public:
	explicit Frame(cv::Mat& cvFrame);
	~Frame();

	cv::Mat			getData		() const;
	std::wstring	getBase64Data	();

	void resize(const int width, const int height);
private:
	void setBase64();

	std::wstring base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len);

private:
	cv::Mat			data;
	std::wstring	base64Representation;

	int width;
	int height;
};