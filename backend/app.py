from flask import Flask, request
import flask
import json
from flask_cors import CORS
from process import *

app = Flask(__name__)
CORS(app)

file = ""

@app.route("/")
def hello():
    return "Hello, World!"

@app.route('/upload', methods=['POST'])
def upload_static_file():
    global file
    print("Got request in static files") 
    print(request.files)
    f = request.files['File']
    print("Saved")
    f.save(f.filename)
    file = f.filename

    resp = {"success": True, "response": "File saved!"}
    return flask.Response(response=json.dumps(resp), status=200)

@app.route('/word', methods=['POST'])
def upload_word():
    global file
    print('Got request in text')
    print(request.data.decode())
    msg = request.data.decode()
    split_msg = msg.split()
    word = split_msg[0]
    numwords = split_msg[1]
    print(file)
    words = process_query(file, word, numwords)
    
    resp = {"success": True, "response": words}
    return flask.Response(response=json.dumps(resp), status=200)

@app.route('/search', methods=['POST'])
def search():
  print('Got search request')
  print(request.data.decode())
  msg = request.data.decode()
  print(f"Type {type(msg)}")
  msg_list = json.loads(msg)
  print(f"Type {type(msg_list)}")
  relevant_lines = search_docs(msg_list)

  resp = {"success": True, "response": json.dumps(relevant_lines)}
  return flask.Response(response=json.dumps(resp), status=200)


if __name__ == "__main__":
    app.run("localhost", 6969)
