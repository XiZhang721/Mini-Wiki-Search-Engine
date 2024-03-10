from flask import Flask, request, jsonify
import json
import search
import redis
import search
import query_completion
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
# r = redis.Redis(host='localhost', port=6379, db=0)

@app.route('/search', methods=['POST','GET'])
# simple search, fast
def get_data():
    query_param = request.args.get('query')
    user_param = request.args.get('user')
    if not query_param:
        return jsonify({'error': 'No value'}), 400
    try:
        query_data = query_param
        if (len(query_data.split(" ")) > 1):
            if (query_data.split(" ")[1] != 'OR' or 
                query_data.split(" ")[1] != 'AND'):
                # query_data = "\"" + str(query_data) + "\"" 
                query_data = " AND ".join(query_data.split(" "))
            
        search_result = search.search(str(query_data))
        
        keys,vals = search.mapping_id(search_result)
        packed = search.package_val(search_result,keys,vals)
        print(search_result)
        return jsonify(search.package_val(search_result,keys,vals))
    except ValueError as e:
        return jsonify({'error': 'Invalid JSON'}), 400

# TODO this is for search_proximity/phrase
# @app.route('/advanced/search', methods=['GET'])

@app.route('/next', methods=['POST','GET'])
def get_next_word():
    query_param = request.args.get('curr')
    pred_val = query_completion.get_content_text_seq(query_param,1)
    return jsonify({'next':pred_val[0]})

if __name__ == '__main__':
    # port = int(os.environ.get('PORT'))
    app.run(host='0.0.0.0')


    