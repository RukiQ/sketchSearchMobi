
#ifndef TYPES_H
#define TYPES_H

#include <vector>
#include <string>
#define _USE_MATH_DEFINES
#include <math.h>
#define NOMINMAX
#define BINARYSTREAM

#include <opencv2/core/core.hpp>
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>
#ifndef Q_MOC_RUN
#include <boost/shared_ptr.hpp>
#include <boost/make_shared.hpp>
#include <boost/function.hpp>
#include <boost/bind.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#endif
typedef unsigned int uint;
namespace sse {

using std::vector;
using std::string;

using cv::Mat;

using boost::property_tree::ptree;



typedef int64_t Index_t;
typedef std::vector<Index_t> Vec_Index_t;

typedef std::vector<float> Vec_f32_t;
typedef std::vector<Vec_f32_t> KeyPoints_t;
typedef std::vector<Vec_f32_t> Features_t;
typedef std::vector<Vec_f32_t> Vocabularys_t;
typedef std::vector<Vec_f32_t> Samples_t; //files has been quantized.

typedef std::pair<float, Index_t> ResultItem_t;

typedef boost::property_tree::ptree PropertyTree_t;


// Returns the value that is stored in the property_tree under path.
// If path does not exist, the default value is returned.
template<class T>
inline T parse(const PropertyTree_t &p, const std::string &path, const T &defaultValue)
{
    T value = p.get(path, defaultValue);
    return value;
}

} //namespace sse

#endif // TYPES_H
