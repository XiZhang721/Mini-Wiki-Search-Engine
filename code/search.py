import Stemmer
import re
import time
import math
import csv
import xml.etree.ElementTree as ET

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

all_stoppings = []
wikis = []

# load stopping words
def load_stoppings(filename:str):
    stoppings = []
    with open(filename, 'r', encoding='UTF-8-sig') as file:
        content = file.read()
        stoppings = re.sub(r"[^a-zA-Z0-9\s]", " ", content.lower())
        stoppings = content.split()
    file.close()
    return stoppings

def load_wiki(filename:str):
    pattern = re.compile(r'^(\d+),\s*([^,]+),\s*(.+)')

    with open(filename, mode='r') as file:
        # Create a CSV reader
        csv_reader = csv.reader(file)
        
        id:int = 0
        title:str = ""
        content:str = ""
        # Iterate over each row in the CSV
        for row in csv_reader:
            row_str = ','.join(row)
            match = pattern.match(row_str)
            if match:
                if(id!=0 and title != "" and content != ""):
                    wikis.append(Wiki(id, title, content))
                #print(match.groups())
                id, title, content = match.groups()
            else:
                content += row_str
        wikis.append(Wiki(id, title, content))
        #print(len(wikis))

def load_index(filename:str):
    parent_dict = dict()
    all_index_set = set()
    with open(filename, 'r', encoding='UTF-8-sig') as file:
        lines = file.readlines()
        is_first = True
        curr_term = term("default")
        for line in lines:
            if(line[0] != "\t"):
                if(not is_first):
                    i = curr_term.token[0]
                    if(i in parent_dict.keys()):
                        child_dict = parent_dict[i]
                        child_dict[curr_term.token] = curr_term
                        parent_dict[i] = child_dict
                    else:
                        child_dict = dict()
                        child_dict[curr_term.token] = curr_term
                        parent_dict[i] = child_dict
                curr_term = term("default")
                is_first = False
                line_splitted =  re.sub(r"[^a-zA-Z0-9\s]", " ", line.lower()).split()
                curr_term.token = line_splitted[0]
                curr_term.count = int(line_splitted[1])
            else:
                line_splitted =  re.sub(r"[^a-zA-Z0-9\s]", " ", line.lower()).split()
                line_int = list(map(int, line_splitted))
                doc_index = line_int.pop(0)
                all_index_set.add(doc_index)
                curr_term.add_appearance(doc_index, line_int)
        
        # adding the last term to the dictionary
        i = curr_term.token[0]
        if(i in parent_dict.keys()):
            child_dict = parent_dict[i]
            child_dict[curr_term.token] = curr_term
            parent_dict[i] = child_dict
        else:
            child_dict = dict()
            child_dict[curr_term.token] = curr_term
            parent_dict[i] = child_dict
            
    file.close()
    return parent_dict, list(all_index_set)

# clean the search word
def clean_search_word(word:str):
    stemmer = Stemmer.Stemmer('english')
    return stemmer.stemWord(re.sub(r"[^a-zA-Z0-9\s]", " ", word.lower())) 

def or_expression(result1:list, result2:list):
    result = list(set(result1) | set(result2))
    return result

def and_expression(result1:list, result2:list):
    result = list(set(result1) & set(result2))
    return result

def not_expression(result1:list):
    result = list(set(all_index) - set(result1))
    return result

# search a single term
def search_single_word(search_index:dict, search_word: str):
    search_word = clean_search_word(search_word)
    result = dict()
    i = search_word[0]
    child_dict = search_index[i]
    if(search_word in child_dict.keys()):
        find_term:term = child_dict[search_word]
        result = find_term.appearances
        return result
    else:
        return result

# phrase search
def search_phrase(search_index:dict, query:str):
    query = re.sub(r"[^a-zA-Z0-9\s]", " ", query.lower())
    terms = query.split()
    filtered_terms = []
    for term in terms:
        if(term not in all_stoppings):
            filtered_terms.append(term)
    
    # print(filtered_terms)
    # find the union of doc that contains all terms
    docs = []
    terms = dict()
    
    for term in filtered_terms:
        single_result = search_single_word(search_index, term)
        if(len(docs) == 0):
            docs = list(single_result.keys())
        else:
            docs = and_expression(docs, list(single_result.keys()))
        terms[term] = single_result

    # remove the appearance that are not in docs for all terms
    filtered_terms = dict()
    for term in terms:
        term_appearance = terms[term]
        filtered_appearance = dict()
        for a in term_appearance.keys():
            if(a in docs):
                #print(a)
                filtered_appearance[a] = term_appearance[a]
        filtered_terms[term] = filtered_appearance

    # get the result by comparing word positions
    result = list()
    for doc in docs:
        word_positions = []
        for key in filtered_terms.keys():
            term = filtered_terms[key]
            word_positions.append(term[doc].word_pos)
        is_match = False
        #print("doc: " + str(doc) + "\nlists: " + str(word_positions) )
        for i in word_positions[0]:
            if((i + 1) in word_positions[1]):
                is_match = True
                break
        if(is_match):
            result.append(doc)
    return result

def search_proximity(search_index:dict, queries:list, n:int):
    terms = list()
    for query in queries:
        terms.append(re.sub(r"[^a-zA-Z0-9\s]", "", query.lower()))
    filtered_terms = []
    for term in terms:
        if(term not in all_stoppings):
            filtered_terms.append(term)
    
    # find the union of doc that contains all terms
    docs = []
    terms = dict()
    
    for term in filtered_terms:
        single_result = search_single_word(search_index, term)
        if(len(docs) == 0):
            docs = list(single_result.keys())
        else:
            docs = and_expression(docs, list(single_result.keys()))
        terms[term] = single_result
    
    # remove the appearance that are not in docs for all terms
    filtered_terms = dict()
    for term in terms:
        term_appearance = terms[term]
        filtered_appearance = dict()
        for a in term_appearance:
            if(a in docs):
                filtered_appearance[a] = term_appearance[a]
        filtered_terms[term] = filtered_appearance

    # seach by comparing word_pos
    result = list()
    for doc in docs:
        word_positions = []
        for key in filtered_terms:
            term = filtered_terms[key]
            word_positions.append(term[doc].word_pos)
        is_match = False
        for i in word_positions[0]:
            if(is_match): break
            for j in word_positions[1]:
                if(abs(j - i) <= n):
                    is_match = True
                    break
        if(is_match):
            result.append(doc)
    return result

# search the index by a query
def search_query(search_index:dict, query:str) -> list:
    if(' OR ' in query):
        parts = query.split(" OR ")
        part1 = parts[0].strip()
        part2 = parts[1].strip()
        part1_result = search_query(search_index, part1)
        part2_result = search_query(search_index, part2)
        result = or_expression(part1_result, part2_result)
        result.sort()
        return result
    elif(' AND ' in query):
        parts = query.split(" AND ")
        part1 = parts[0].strip()
        part2 = parts[1].strip()
        part1_result = search_query(search_index, part1)
        part2_result = search_query(search_index, part2)
        result = and_expression(part1_result, part2_result)
        result.sort()
        return result
    elif('NOT ' in query):
        parts = query.split("NOT ")
        part1 = parts[1].strip()
        part1_result = search_query(search_index, part1)
        result = not_expression(part1_result)
        result.sort()
        return result
    elif("#" in query):
        n = 0
        queries = []
        match = re.search(r'#(\d+)\(([^)]+)\)', query)        
        if match:
            n = int(match.group(1))
            queries = [x.strip() for x in match.group(2).split(',')]
        result = search_proximity(search_index,queries,n)
        result.sort()
        return result
    elif("\"" in query):
        result = search_phrase(search_index,query)
        result.sort()
        return result
    else:
        result = list(search_single_word(search_index, query).keys())
        result.sort()
        return result

def get_title(id:int)->str:
    for wiki in wikis:
        if (int(wiki.id) == id):
            return wiki.title
    return None

if __name__ == "__main__":
    start_time = time.time()
    load_wiki("data/wiki_300.csv")
    all_stoppings = load_stoppings("data/stoppings.txt")
    search_index, all_index = load_index('data/index.txt')
    all_index.sort()
    print("Loading Finished, Time Used:" + str((time.time() - start_time)))

    # The searching
    start_time = time.time()
    query  = "John"
    search_result = search_query(search_index, query)
    print("Searching Finished, Time Used:" + str((time.time() - start_time)))
    if(len(search_result) == 0):
        print("No search result found.")
    else:
        print("The search result:")
        for id in search_result:
            print("id: " + str(id) +"; title: " + get_title(id))
