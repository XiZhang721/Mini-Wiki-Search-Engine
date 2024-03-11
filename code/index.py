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

all_index = []
all_stoppings = []
wikis = []

# removing stopping words for list of tokens
def clean_tokens(tokens:list, stopping_words:list):
    cleaned_tokens = []
    for token in tokens:     
        if(token not in stopping_words):
            cleaned_tokens.append(token)
    return cleaned_tokens

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
    with open(filename, mode='r') as file:
        # Create a CSV reader
        csv_reader = csv.reader(file)
        # Iterate over each row in the CSV
        for row in csv_reader:
            row_str = ','.join(row)
            parts = row_str.split(',', 2)
            id, title, content = parts
            wikis.append(Wiki(id, title, content))
        print(len(wikis))

def get_tokens(stopping_words:list):
    stemmer = Stemmer.Stemmer('english')
    index_dict = dict()
    for wiki in wikis:
        tokens = (wiki.title + ' ' + wiki.content).lower()
        #print(tokens)
        tokens = re.sub(r"[^a-zA-Z0-9\s]", " ", tokens).split()
        cleaned_tokens = stemmer.stemWords(clean_tokens(tokens, stopping_words))
        #print(cleaned_tokens)
        index_dict[wiki.id] = cleaned_tokens
    return index_dict

# generate index from tokens
def load_terms(index_dict:dict):
    loaded_terms = dict()
    for index in index_dict:
        tokens = index_dict[index]
        token_index = 0
        tokens_dict = dict()

        for token in tokens:
            if(token not in tokens_dict.keys()):
                tokens_dict[token] = list()
            tokens_dict[token].append(token_index)
            token_index += 1

        for token in tokens_dict.keys():
            if(token not in loaded_terms.keys()):
                new_term = term(token)
                new_term.add_appearance(index, tokens_dict[token])
                loaded_terms[token] = new_term
            else:
                curr_term:term = loaded_terms[token]
                curr_term.add_appearance(index, tokens_dict[token])
                loaded_terms[token] = curr_term

    return loaded_terms

# write the index file to local
def write_local(filename:str, terms:dict):
    with open(filename, 'w', encoding='UTF-8-sig') as file:
        for key in terms.keys():
            term = terms[key]
            file.write(key+":" + str(term.count) + "\n")
            for k in term.appearances.keys():
                a = term.appearances[k]
                file.write("\t" + str(a.doc_index)+": " + str(",".join(map(str,a.word_pos))) + "\n")
    file.close()
if __name__ == "__main__":
    # change the path to the entire dataset
    load_wiki("data/wiki_300.csv")
    all_stoppings = load_stoppings("data/stoppings.txt")
    search_index = get_tokens(all_stoppings)
    terms = load_terms(search_index)
    write_local("data/index.txt", terms)
    
    