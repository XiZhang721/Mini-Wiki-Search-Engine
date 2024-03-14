import Stemmer
import re
import time
import math
import csv
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures
from flask import Flask, request, jsonify
import redis
import json
import time
import random

# app = Flask(__name__)
# r = redis.Redis(host='localhost', port=6379, db=0)

pool0 = redis.ConnectionPool(host='34.163.26.53', port=6379, db=0, password='114514')
pool1 = redis.ConnectionPool(host='34.163.26.53', port=6379, db=1, password='114514')
pool2 = redis.ConnectionPool(host='34.163.26.53', port=6379, db=2, password='114514')
pool3 = redis.ConnectionPool(host='34.163.26.53', port=6379, db=3, password='114514')

r = redis.StrictRedis(connection_pool=pool0)
r1 = redis.StrictRedis(connection_pool=pool1)
r2 = redis.StrictRedis(connection_pool=pool2)
r3 = redis.StrictRedis(connection_pool=pool3)

clean_regex = re.compile(r"[^a-zA-Z0-9\s]")

def return_title_f(a_list):
    return [ (r1.hkeys(i))[0].decode() for i in a_list]

def search_category(str_id):
    return (r3.hkeys(str_id))[0].decode()

def given_random_value(category:str):
    sample_size = 10  
    random_samples = []
    cursor = random.randint(0,1000000)
    # random.randint(0,10)
    _, data = r2.hscan(category, cursor=str(cursor), count=sample_size)
        # print(data)
    random_samples = [i.decode() for i in data.keys()]
    return random_samples[:3]


def convert_getall(getall_val):
    return {key.decode(): [item for item in json.loads(value.decode())] for key, value in getall_val.items()}

def convert_getall_deckey(getall_val):
    return {key.decode(): None for key, _ in getall_val.items()}

def convert_only_key(getall_key): 
    a_list = []
    for key in getall_key:
        try:
            a_list.append(key.decode())
        except:
            continue
    return a_list

def convert_get(get_val):
    if (get_val == None or get_val==[]):
        return []
    return [value for value in json.loads(get_val.decode())]



class Wiki():
    def __init__(self, id, title, content):
        self.id:int = id
        self.title:str = title
        self.content:str = content

class appearance():
    def __init__(self,doc_index:int, word_pos:list):
        self.doc_index = doc_index
        self.word_pos = word_pos

class term:
    def __init__(self, token:str):
        self.token = token
        self.count = 0
        self.appearances = dict()

    def add_appearance(self, doc_index:int, word_pos:list):
        self.count += 1
        self.appearances[doc_index] = appearance(doc_index,word_pos)

# load stopping words
def load_stoppings(filename:str):
    with open(filename, 'r', encoding='UTF-8-sig') as file:
        content = file.read()
        stoppings = clean_regex.sub(" ", content.lower())
        stoppings = set(content.split())
    file.close()
    return stoppings

all_stoppings = load_stoppings("stoppings.txt")
wikis = []

# clean the search word
def clean_search_word(word:str):
    stemmer = Stemmer.Stemmer('english')
    return stemmer.stemWord(clean_regex.sub(" ", word.lower())) 

def or_expression(result1:list, result2:list):
    result = list(set(result1) | set(result2))
    return result

def and_expression(result1:list, result2:list):
    result = list(set(result1) & set(result2))
    return result

# def not_expression(result1:list):
#     result = list(set(all_index) - set(result1))
#     return result

# search a single term
def search_single_word(search_word: str):
    search_word = clean_search_word(search_word)
    # start_time = time.time()
    i = r.hgetall(search_word)
    # i = r.hvals(search_word)
    # print("hgetall Searching Finished, Time Used:" + str((time.time() - start_time)))   
    # start_time = time.time() 
    # print(i)
    result = convert_getall_deckey(i)
    # print("Searching Finished, Time Used:" + str((time.time() - start_time)))   
    return result

    
# search a single term_only key
def search_single_word_ONLY_KEY(search_word: str):
    search_word = clean_search_word(search_word)
    i = r.hkeys(search_word)
    result = convert_only_key(i)
    # print(result)
    return result


# phrase search
def search_phrase(query:str):
    # start_time = time.time()
    query = clean_regex.sub(" ", query.lower())
    terms = query.split()
    filtered_terms = [clean_search_word(term) for term in terms if term not in all_stoppings]
    # filtered_terms = []
    # for term in terms:
    #     if(term not in all_stoppings):
    #         term = clean_search_word(term)
    #         filtered_terms.append(term)
    
    # print(filtered_terms)
    # find the union of doc that contains all terms
    docs = []
    # terms = dict()
    if (len(filtered_terms) == 1):
        return search_single_word_ONLY_KEY(filtered_terms[0])
    
    
    
    # start_time2 = time.time()
    #***Single Thread***
    for term in filtered_terms:
        # start_time = time.time()
        single_result = search_single_word_ONLY_KEY(term)
        # print("sing      , Time Used:" + str(time.time() - start_time))
        if(len(docs) == 0):
            # start_time = time.time()
            docs = single_result
            # print("if      , Time Used:" + str(time.time() - start_time))
        else:
            docs = and_expression(docs, single_result)
            # print("else  , Time Used:" + str(time.time() - start_time))
        # terms[term] = single_result

    # print("2  , Time Used:" + str(time.time() - start_time2))

    # start_time = time.time()
    # get the result by comparing word positions
    result = list()
    for doc in docs:
        pipeline = r.pipeline()
        for term in filtered_terms:
            pipeline.hget(term, doc)
        aa = pipeline.execute()
        word_positions = [convert_get(ab) for ab in aa]
        # word_positions = [convert_get(r.hget(term, doc)) for term in filtered_terms]
        # for term in filtered_terms:
        #     # term = clean_search_word(term)
        #     word_positions.append(convert_get(r.hget(term,str(doc))))
        is_match = True
        # print(word_positions)
        for i in word_positions[0]:
            is_match = True
            for j in range(1, len(word_positions)):
                currMatch = False
                for k in word_positions[j]:
                    if(k - i == j ):
                        currMatch = True
                        break
                is_match = is_match and currMatch
                if not is_match:
                    break
            if(is_match):
                result.append(doc)
                break
    return result

def search_proximity(queries:list, n:int):
    terms = list()
    # print(queries)
    for query in queries:
        terms.append(clean_regex.sub("", query.lower()))
    # filtered_terms = []
    # # print(terms
    # for term in terms:
    #     if(term not in all_stoppings):
    #         filtered_terms.append(term)
    filtered_terms = [clean_search_word(term) for term in terms if term not in all_stoppings]
    # find the union of doc that contains all terms
    docs = []
    # terms = dict()
    if (len(filtered_terms) == 1):
        return search_single_word_ONLY_KEY(filtered_terms[0])
    
  
    for term in filtered_terms:
        # print(term)
        single_result = search_single_word_ONLY_KEY(term)
        # print(term, single_result)
        if(len(docs) == 0):
            # docs = list(single_result.keys())
            docs = single_result
        else:
            docs = and_expression(docs, single_result)
        # terms[term] = single_result
    # # remove the appearance that are not in docs for all terms
    # searched_terms = dict()
    # for term in filtered_terms:
    #     term_appearance = terms[term]
    #     filtered_appearance = dict()
    #     for a in term_appearance:
    #         if(a in docs):
    #             filtered_appearance[a] = term_appearance[a]
    #     searched_terms[term] = filtered_appearance

    # st = time.time()
    # seach by comparing word_pos
    result = list()
    ### TODO: Rewrite this function to speed up 10x
    # print(docs)
    for doc in docs:
        pipeline = r.pipeline()
        for term in filtered_terms:
            pipeline.hget(term, doc)
        aa = pipeline.execute()
        word_positions = [convert_get(ab) for ab in aa]
        # for term in filtered_terms:
        #     term = clean_search_word(term)
        #     # print(r.hget('henry',214730))
        #     word_positions.append(convert_get(r.hget(term,doc)))
        is_match = True
        for i in word_positions[0]:
            is_match = True
            prev = i
            for j in range(1, len(word_positions)):
                currMatch = False
                for k in word_positions[j]:
                    if(abs(k - prev) <=  n):
                        currMatch = True
                        prev = k
                        break
                is_match = is_match and currMatch
                if not is_match:
                    break
            if(is_match):
                result.append(doc)
                break
    # print("ST =>>> ", time.time() - st)
    return result

# tested and found not working faster, no longer using
def search_two_parts(search_index:dict, part1:str, part2:str)->list:
    futures = []
    results = []
    with ThreadPoolExecutor() as executor:
        future1 = executor.submit(search_query, search_index, part1)
        futures.append(future1)
        future2 = executor.submit(search_query, search_index, part2)
        futures.append(future2)
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())
    return results

# search the index by a query
def search_query(query:str) -> list:
    if(' OR ' in query):
        parts = query.split(" OR ",1)
        result1 = search_query(parts[0].strip())
        result2 = search_query(parts[1].strip())
        result = or_expression(result1, result2)
        # print(result)
        # The one using multi-threading:
        # results = search_two_parts(search_index,parts[0].strip(),parts[1].strip())
        # result = or_expression(results[0], results[1])
        # result.sort()
        return result
    elif(' AND ' in query):
        parts = query.split(" AND ",1)
        result1 = search_query(parts[0].strip())
        result2 = search_query(parts[1].strip())
        result = and_expression(result1,result2) 
        # print(result)
        # The one using multi-threading:
        # results = search_two_parts(search_index,parts[0].strip(),parts[1].strip())
        # result = and_expression(results[0], results[1])
        # result.sort()
        return result
    elif('NOT ' in query):
        parts = query.split("NOT ",1)
        part1 = parts[1].strip()
        part1_result = search_query(part1)
        # result = not_expression(part1_result)
        result = list(search_single_word_ONLY_KEY(query))
        # result.sort()
        return result
    elif("#" in query):
        n = 0
        queries = []
        match = re.search(r'#(\d+)\(([^)]+)\)', query)        
        if match:
            n = int(match.group(1))
            queries = [x.strip() for x in match.group(2).split(',')]
        result = search_proximity(queries,n)
        # result.sort()
        return result
    elif("\"" in query):
        result = search_phrase(query)
        # result.sort()
        return result
    else:
        result = list(search_single_word_ONLY_KEY(query))
        # result.sort()
        return result

def get_title(id:int)->str:
    for wiki in wikis:
        if (int(wiki.id) == id):
            return wiki.title
    return None

# TODO: sort
def search(query:str)-> list:
    result = search_query(query=query)
    clean_q = [clean_search_word(i) for i in re.split(' AND | OR ',query)]
    # st = time.time()
    # record = []
    # for i in range(len(result)):
    #     val_res = 0
    #     for j in clean_q:
    #         val_res += len(r.hget(j,result[i]))
    #     record.append((val_res,result[i]))
    # print('first=>>>> ', time.time() -st)
        
    # st = time.time()
    record_1 = [(0,i) for i in result]
    # print(len(record_1))
    # print(clean_q)
    for j in clean_q:
        record_1 =[(x+len(i), y) if i != None else (x,y) for (x,y),i in zip(record_1,r.hmget(j,result))]
        # for (x,y),i in zip(record_1,r.hmget(j,result)):
        #     if(i != None):
        #         print((x,y), i)
        #         break
    # print('seccc=>>>> ', time.time() -st)
    record_1.sort(reverse=True)    
    
    # record.sort(reverse=True)
    # print()
    # return [y for _,y in record] == [y for _,y in record_1]
    temp = [y for _,y in record_1]
    # limit = 50
    # if (len(temp) <= limit):
    #     return temp
    # else:
    #     return temp[:limit] 
    return temp

def mapping_id(a_list):
    return [((r1.hkeys(i))[0]).decode() for i in a_list], [((r1.hvals(i))[0]).decode() for i in a_list]

def package_val(a,b,c):
    return [{'id': id, 'title': title, 'value': value} for id, title, value in zip(a, b, c)]
    


# @app.route('/search', methods=['GET'])
# def get_data():
#     query_param = request.args.get('query')
#     user_param = request.args.get('user')
#     if not query_param:
#         return jsonify({'error': 'No value'}), 400
#     try:
#         query_data = query_param
#         # temp = query_data.split(" ")
#         if (query_data.split(" ")[1] != 'OR' or 
#             query_data.split(" ")[1] != 'AND'):
#             query_data = "\"" + str(query_data) + "\"" 
        
#         print(query_data)
#         search_result = search_query(str(query_data))
#         # print(str(search_result))
#         return str(search_result)
#     # jsonify(query_data)
#     except ValueError as e:
#         return jsonify({'error': 'Invalid JSON'}), 400

# if __name__ == "__main__":
#     start_time = time.time()
    # all_stoppings = load_stoppings("data/stoppings.txt")
    # search_index, all_index = load_index('data/index.txt')
    # print(given_random_value("Company"))
    # print(search_category('668033'))
    
    # all_index.sort()
    # print("Loading Finished, Time Used:" + str((time.time() - start_time)))
    # print(len(all_index))
    # print(search_query(search_index=search_index, query="Xi AND Jin AND Ping"))
    # The searching
    # start_time = time.time()
    # query_and  = "Hallam AND Windsor AND Bristol AND Christ AND Church"
    # query_phrase = "\"literary work was undertaken\""
    # search_result = search_query(search_index, query_phrase)
    # print("Searching Finished, Time Used:" + str((time.time() - start_time)))
    # if(len(search_result) == 0):
    #     print("No search result found.")
    # else:
    #     print("The search result:")
    #     for id in search_result:
    #         print("id: " + str(id) +"; title: " + get_title(id))
    # temp = dict()
    # start_time = time.time()
    # query_phrase  = "Xi AND Jin AND Ping"
    # query_phrase  = "Harry AND Potter"
    # query_phrase = "\"literary work was undertaken\""
    # query_phrase = "\"harry potter\""
    # query_prox = "#2(Henry, Hallam)"
    # search_result = r.hkeys("work")
    # search_result = search_query(query_prox)
    # search_single_word_ONLY_KEY('hallam')
    # search_single_word_ONLY_KEY('henry')
    # r.hgetall('henry')
    # print(r.hget('segment','6584222'))
    # print(r.hget('henry',214730))
    # search_result = search_single_word_ONLY_KEY("Work")
    # search_single_word("harry")
    # r.hgetall("harry")
    # print("Searching Finished, Time Used:" + str((time.time() - start_time)))
    # print(search_result)
    # start_time = time.time()
    # search_single_word(dict(),"xi")
    # print("Searching Finished, Time Used:" + str((time.time() - start_time)))
    # start_time = time.time()
    # r.hgetall('xi')
    # print("Searching Finished, Time Used:" + str((time.time() - start_time)))
    # app.run(host='localhost', port=33311,debug=True)

