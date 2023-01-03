import os, json
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson import json_util, ObjectId

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
app = Flask(__name__)

def parse_json(data):
    data = json.loads(json_util.dumps(data))
    return data

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/mars', methods=['POST'])
def web_mars_post():
    name_receive = request.form['name_give']
    address_receive = request.form['address_give']
    size_receive = request.form['size_give']
    doc={
        'name': name_receive,
        'address': address_receive,
        'size': size_receive
    }
    db.orders.insert_one(doc)
    print(name_receive, address_receive, size_receive)
    return jsonify({'msg': 'Complete!'})


@app.route('/mars', methods=['GET'])
def web_mars_get():
    orders_list = list(db.orders.find())
    return parse_json(orders_list)

@app.route('/mars/delete', methods=['POST'])
def web_mars_del():
    data_id = request.form['id']
    db.orders.delete_one({'_id': ObjectId(data_id)})

    return jsonify({'msg': 'Deleted successfully!'})

@app.route('/mars/update', methods=['POST'])
def web_mars_update():
    data_id = request.form['id']
    name = request.form['name']
    address = request.form['address']
    size = request.form['size']

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