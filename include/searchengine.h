#ifndef SEARCHENGINE_H
#define SEARCHENGINE_H

#include <string>
#include <vector>
#include "include/types.h"
using namespace sse;

struct QueryResult
{
        std::string imageName;
        std::string modelName;
        uint imageIndex;
        float ratio;

        bool operator< (const QueryResult& r) const
        {
                return ratio > r.ratio;
        }
};

typedef std::vector<QueryResult> QueryResults;

/**
 * @brief The SearchEngine class
 * Search engine interface
 */
class SearchEngine
{
public:
    virtual void query(const std::string &fileName, QueryResults& results) = 0;
    virtual ~SearchEngine(){}
};

#endif // SEARCHENGINE_H
