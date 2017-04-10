#ifndef SKETCHSEARCHER_H
#define SKETCHSEARCHER_H

#include "searchengine.h"

#include "include/types.h"
#include "include/distance.h"
#include "include/galif.h"
#include "include/quantizer.h"
#include "include/reader_writer.h"
#include "include/invertedindex.h"
#include "include/filelist.h"

class SketchSearcher : public SearchEngine
{
public:
    SketchSearcher(const sse::PropertyTree_t &parameters);
    void query(const std::string &fileName, QueryResults &results);

private:
    boost::shared_ptr<sse::InvertedIndex> index;
    boost::shared_ptr<sse::Galif> galif;
    boost::shared_ptr<sse::FileList> files;

    sse::Vocabularys_t vocabulary;
    sse::Quantizer_fn quantizer;

    const std::string _indexFile;
    const std::string _vocabularyFile;
    const std::string _rootdir;
    const std::string _fileList;
    const std::string _modeldir;
    const unsigned int _numOfResults;
    const unsigned int _numOfViews;
};

extern "C"  __declspec(dllexport) void _stdcall  Query(const char* filename, const char* resultFilename);

#endif // SKETCHSEARCHER_H
