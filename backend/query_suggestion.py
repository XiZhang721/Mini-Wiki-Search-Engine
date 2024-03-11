from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

file_path = 'checkpoints/queries.txt'

# 使用with语句打开文件，确保文件会被正确关闭
with open(file_path, 'r', encoding='utf-8') as file:
    # 使用readlines方法读取所有行到一个列表
    queries_list = file.readlines()

# readlines会在每个元素的末尾包含换行符'\n'，你可能想要移除它们
queries_list = [query.strip() for query in queries_list]


# 加载TF-IDF向量化器
with open('checkpoints/vectorizer.pickle', 'rb') as f:
    vectorizer = pickle.load(f)

# 加载TF-IDF矩阵
with open('checkpoints/tfidf_matrix.pickle', 'rb') as f:
    tfidf_matrix = pickle.load(f)


# 定义一个函数来提供建议
def suggest_queries(query, top_n=3):
    query_tfidf = vectorizer.transform([query])
    cos_similarity = cosine_similarity(query_tfidf, tfidf_matrix)

    # 获取最相似查询的索引
    similar_queries_indices = cos_similarity[0].argsort()[-top_n:][::-1]

    suggestions = [queries_list[i] for i in similar_queries_indices]
    return suggestions


# 示例：查找与"Harry Potter"相似的查询
# suggestions = suggest_queries("Harry Potter")
# print(suggestions)