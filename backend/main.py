from flask import Flask, request, jsonify
import json
import search
import redis
import search
import query_completion
import query_suggestion
from flask_cors import CORS
import os
import firebase_admin
from firebase_admin import credentials, initialize_app,db

app = Flask(__name__)
CORS(app)
# r = redis.Redis(host='localhost', port=6379, db=0)
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred, {
	'databaseURL':'https://ttds-412917-default-rtdb.europe-west1.firebasedatabase.app'})
ref = db.reference("/")

label_dict = {
    "0": "Company",
    "1": "EducationalInstitution",
    "2": "Artist",
    "3": "Athlete",
    "4": "OfficeHolder",
    "5": "MeanOfTransportation",
    "6": "Building",
    "7": "NaturalPlace",
    "8": "Village",
    "9": "Animal",
    "10": "Plant",
    "11": "Album",
    "12": "Film",
    "13": "WrittenWork",
}

@app.route('/register', methods=['POST','GET'])
def test():
    username = request.args.get('username')
    username_ref = ref.child('user')
    username_ref.child(username).set({
    "Company": 0,
    "EducationalInstitution": 0,
    "Artist": 0,
    "Athlete": 0,
    "OfficeHolder": 0,
    "MeanOfTransportation": 0,
    "Building": 0,
    "NaturalPlace": 0,
    "Village": 0,
    "Animal": 0,
    "Plant": 0,
    "Album": 0,
    "Film": 0,
    "WrittenWork": 0,
})
    return jsonify({"status":"registered"})

# @app.route('/get', methods=['POST','GET'])
def get_user_info(user_name:str):
    # username = request.args.get('username')
    username_ref = ref.child('user')
    user_info = username_ref.child(user_name)
    return user_info.get()

def update_user_info(user_name:str, category:str):
    # username = request.args.get('username')
    username_ref = ref.child('user')
    user_info = username_ref.child(user_name)
    # user_info.update(updated_val)
    user_info.update({category: user_info.get()[category]+1})


@app.route('/search', methods=['POST','GET'])
# simple search, fast
def get_data():
    query_param = request.args.get('query')
    # user_param = request.args.get('user')
    if not query_param:
        return jsonify({})
    try:
        query_data = query_param
        if (len(query_data.split(" ")) > 1):
            if (query_data.split(" ")[1] != 'OR' or 
                query_data.split(" ")[1] != 'AND'):
                # query_data = "\"" + str(query_data) + "\"" 
                query_data = " AND ".join(query_data.split(" "))
            
            search_result = search.search(str(query_data))
            if (search_result == []):
                query_data = " OR ".join(query_data.split(" "))
                search_result = search.search(str(query_data))
        else:
            search_result = search.search(str(query_data))
        
        keys,vals = search.mapping_id(search_result)
        packed = search.package_val(search_result,keys,vals)
        # print(search_result)
        return jsonify(packed)
    except ValueError as e:
        return jsonify({})

# TODO this is for search_proximity/phrase
@app.route('/advanced/search', methods=['POST','GET'])
def get_adv_data():
    query_param = request.args.get('query')
    bool_param = request.args.get('booltype')
    if not query_param:
        return jsonify({})
    try:
        query_param = query_param.split("@")
        # temp = list(query_param)
        # print(temp)
        # temp_len = len(temp)
        record = []
        for i in query_param:
            key_a, type_a, val_a = i.split('-')
            val_a = int(val_a)
            if (type_a == 'phrase'):
                key_a = str(key_a)
                record.append(set(search.search_phrase(key_a)))
            else:
                key_a = str(key_a).split(' ')
                # print(search.search_proximity(key_a,val_a))
                record.append(set(search.search_proximity(key_a,val_a)))
        if (bool_param == 'AND'):
            search_result = list(set.intersection(*record))
        else:
            search_result = list(set.union(*record))
        keys,vals = search.mapping_id(search_result)
        packed = search.package_val(search_result,keys,vals)
        return jsonify(packed)    
    except ValueError as e:
        return jsonify({})
        

@app.route('/next', methods=['POST','GET'])
def get_next_word():
    curr_param = request.args.get('curr')
    pred_val = query_completion.get_content_text_seq(curr_param,1)
    return jsonify({'next':pred_val[0]})


@app.route('/update', methods=['POST','GET'])
def update_user():
    id_param = request.args.get('id')
    username_param = request.args.get('username')
    if not id_param:
        return jsonify({})
    try:
        if (username_param != "" or username_param != None or username_param !='null'):
            update_user_info(username_param, search.search_category(id_param))
        update_user_info("server", search.search_category(id_param))
        return jsonify({'value':'received'})
    except ValueError as e:
        return jsonify({})
    
@app.route('/suggest', methods=['POST','GET'])
def provide_suggest_query():
    query_param = request.args.get('query')
    temp_list = query_suggestion.suggest_queries(query=query_param)
    return jsonify([{'query':temp_list[0]},
                    {'query':temp_list[1]},
                    {'query':temp_list[2]}])
    

@app.route('/recommend', methods=['POST','GET'])
def give_recommend():
    username_param = request.args.get('username')
    print(username_param)
    if (username_param == "" or 
        username_param == None or 
        username_param=='null'):
        # result = search.given_random_value("Company")
        # return jsonify([{'query':result[0]},
        #             {'query':result[1]},
        #             {'query':result[2]}]) 
        username_param = 'server'
   
    usr_info = get_user_info(username_param)
    # print(usr_info)
    result_max = max(usr_info, key=usr_info.get)
    result = search.given_random_value(result_max)
    result = search.return_title_f(result)
    return jsonify([{'query':result[0]},
                    {'query':result[1]},
                    {'query':result[2]}]) 
    
    

if __name__ == '__main__':
    # port = int(os.environ.get('PORT'))
    app.run(host='0.0.0.0')


    