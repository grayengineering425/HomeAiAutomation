#include "InferImage.h"

InferImage::InferImage(cv::Mat & cvImage) : 
		dims(224)
	,	data(cvImage)
{
	cv::resize(data, data, cv::Size(dims, dims), 0, 0, cv::INTER_CUBIC);
}

std::vector<Box> InferImage::getBoxes() const
{
	return boundingBoxes;
}

void InferImage::addBox(Box & box)
{
	boundingBoxes.emplace_back(box);

	int x = std::max(0, int(box.center.x * 64.0 + (box.cellX * 64.0)));
	int y = std::max(0, int(box.center.y * 64.0 + (box.cellY * 64.0)));
	int width = std::max(0, int(box.width   * 448.0));
	int height = std::max(0, int(box.height * 448.0));

	cv::rectangle(data, cv::Point(x - width, y - height), cv::Point(x + width, y + height), (0, 255, 0), 2);
	//cv::Mat croppedImage = data(cv::Rect(cv::Point(std::max(0, x - width), std::max(0, y - height)),
	//	cv::Point(std::min(447, x + width), std::min(447, y + height))));
	//cv::resize(croppedImage, croppedImage, cv::Size(200, 180));
}

void InferImage::resize(int width, int height)
{
	if (data.empty()) return;

	cv::resize(data, data, cv::Size(width, height));
}

size_t		InferImage::numFaces		() const { return boundingBoxes.size(); }
cv::Mat		InferImage::getData			() const { return data;					}
int			InferImage::getDimensions	() const { return dims;					}
std::string InferImage::getBase64Data	() const { return base64Representation; }


//----------------------------------------------------------------------------------------------------------------------------//

static const std::string base64_chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
"abcdefghijklmnopqrstuvwxyz"
"0123456789+/";

void InferImage::setBase64()
{
	std::vector<uchar> buf;
	buf.resize(data.rows * data.cols * data.channels());

	cv::imencode(".jpg", data, buf);

	uchar *enc_msg = new uchar[buf.size()];

	for (int i = 0; i < buf.size(); i++) enc_msg[i] = buf[i];

	base64Representation = base64_encode(enc_msg, buf.size());
}

std::string InferImage::base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len) {
	std::string ret;
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

			for (i = 0; (i <4); i++)
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
