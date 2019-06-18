#pragma once
#include <vector>
#include <opencv2/opencv.hpp>

struct Box
{
	struct Point
	{
		Point(double X, double Y) : 
				x(X)
			,	y(Y)
		{}
		~Point() = default;

		double x, y;
	};

	Box(Point& Center, double Width, double Height, int x, int y) : 
			center	(Center	)
		,	width	(Width	)
		,	height	(Height	)
		,	cellX	(x)
		,	cellY	(y)
	{}
	~Box() = default;
	
	Point	center;
	double	width;
	double	height;

	int cellX, cellY;
};

class InferImage
{
public:
	InferImage(cv::Mat& cvImage);
	~InferImage() = default;

	size_t				numFaces		() const;
	cv::Mat				getData			() const;
	std::string			getBase64Data	() const;
	int					getDimensions	() const;
	std::vector<Box>	getBoxes		() const;

	void addBox(Box&  box);

	void resize(int width, int height);

private:
	void setBase64();

	std::string base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len);

private:
	std::vector<Box>	boundingBoxes;
	cv::Mat				data;

	std::string base64Representation;

	int dims;
};