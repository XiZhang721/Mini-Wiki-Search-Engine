from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import re
from datasets import load_dataset
dataset = load_dataset("wiki_qa")

query_list = {}
for train_data in dataset['train']:
    if train_data['question_id'] not in query_list:
        query_list[train_data['question_id']] = train_data['question']
for train_data in dataset['validation']:
    if train_data['question_id'] not in query_list:
        query_list[train_data['question_id']] = train_data['question']
for train_data in dataset['test']:
    if train_data['question_id'] not in query_list:
        query_list[train_data['question_id']] = train_data['question']

def Clean_data(data):
    """Removes all the unnecessary patterns and cleans the data to get a good sentence"""
    repl = ''  # String for replacement

    # removing all open brackets
    data = re.sub('\(', repl, data)

    # removing all closed brackets
    data = re.sub('\)', repl, data)

    # Removing all the headings in data
    for pattern in set(re.findall("=.*=", data)):
        data = re.sub(pattern, repl, data)

    # Removing unknown words in data
    for pattern in set(re.findall("<unk>", data)):
        data = re.sub(pattern, repl, data)

    # Removing all the non-alphanumerical characters
    for pattern in set(re.findall(r"[^\w ]", data)):
        repl = ''
        if pattern == '-':
            repl = ' '
        # Retaining period, apostrophe
        if pattern != '.' and pattern != "\'":
            data = re.sub("\\" + pattern, repl, data)

    return data

cleaned_data = []
for q_index, question in query_list.items():
    data = Clean_data(question)
    cleaned_data.append(data)



# File path where you want to store the strings
file_path = 'queries.txt'

# Open the file in write mode ('w') and store the strings
with open(file_path, 'w', encoding='utf-8') as file:
    # Write each string on a new line
    for query in cleaned_data:
        file.write(query + '\n')

# 使用TF-IDF向量化器
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(cleaned_data)

import pickle

# 保存TF-IDF向量化器和矩阵到文件
with open('vectorizer.pickle', 'wb') as f:
    pickle.dump(vectorizer, f)

with open('tfidf_matrix.pickle', 'wb') as f:
    pickle.dump(tfidf_matrix, f)

