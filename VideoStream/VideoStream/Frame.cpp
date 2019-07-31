#pragma once
#include "Frame.h"

#include "Frame.h"

Frame::Frame(cv::Mat & cvImage)
	:	data				(cvImage)
	,	base64Representation(L""	)
	,	width				(720	)
	,	height				(480	)
{
	cv::resize(data, data, cv::Size(width, height), 0, 0, cv::INTER_LINEAR);
}

Frame::~Frame() = default;

void Frame::resize(int w, int h)
{
	if (data.empty()) return;

	width  = w;
	height = h;
	cv::resize(data, data, cv::Size(width, height));
}

cv::Mat			Frame::getData		() const	{ return data;																		}
std::wstring	Frame::getBase64Data()			{ if (base64Representation.empty()) { setBase64(); } return base64Representation;	}


//----------------------------------------------------------------------------------------------------------------------------//

static const std::string base64_chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
"abcdefghijklmnopqrstuvwxyz"
"0123456789+/";

void Frame::setBase64()
{
	std::vector<uchar> buf;
	buf.resize(data.rows * data.cols * data.channels());

	cv::imencode(".jpg", data, buf);

	uchar *enc_msg = new uchar[buf.size()];

	for (int i = 0; i < buf.size(); i++) enc_msg[i] = buf[i];

	base64Representation = base64_encode(enc_msg, static_cast<unsigned int>(buf.size()));
}

std::wstring Frame::base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len) {
	std::wstring ret;
	int i = 0;
	int j = 0;
	unsigned char char_array_3[3];
	unsigned char char_array_4[4];

	while (in_len--) {
		char_array_3[i++] = *(bytes_to_encode++);
		if (i == 3) {
			char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
			char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
			char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
			char_array_4[3] = char_array_3[2] & 0x3f;

			for (i = 0; (i < 4); i++)
				ret += base64_chars[char_array_4[i]];
			i = 0;
		}
	}

	if (i)
	{
		for (j = i; j < 3; j++)
			char_array_3[j] = '\0';

		char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
		char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
		char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);

		for (j = 0; (j < i + 1); j++)
			ret += base64_chars[char_array_4[j]];

		while ((i++ < 3))
			ret += '=';

	}

	return ret;

}
