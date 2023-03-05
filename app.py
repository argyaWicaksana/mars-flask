import os, json
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_cors import CORS

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

def parse_json(data):
    data = json.loads(json_util.dumps(data))
    return data

@app.route('/', methods=['POST'])
def web_mars_post():
    name_receive = request.json['name']
    address_receive = request.json['address']
    size_receive = request.json['size']
    doc={
        'name': name_receive,
        'address': address_receive,
        'size': size_receive
    }
    db.orders.insert_one(doc)
    print(name_receive, address_receive, size_receive)
    return jsonify({'msg': 'Complete!'})


@app.route('/', methods=['GET'])
def web_mars_get():
    orders_list = list(db.orders.find())
    return parse_json(orders_list)

@app.route('/', methods=['DELETE'])
def web_mars_del():
    data_id = request.json['id']
    db.orders.delete_one({'_id': ObjectId(data_id)})

    return jsonify({'msg': 'Deleted successfully!'})

@app.route('/', methods=['PUT'])
def web_mars_update():
    data_id = request.json['id']
    name = request.json['name']
    address = request.json['address']
    size = request.json['size']

    db.orders.update_one({'_id': ObjectId(data_id)}, {
        '$set': {
            'name': name,
            'address': address,
            'size': size
        }
    })

    return jsonify({'msg': 'Updated successfully!'})


if __name__ == '__main__' :
    app.run('localhost', port=5000, debug=True)