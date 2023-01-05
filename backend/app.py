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


""" @app.route('/users', methods=["GET", "POST"])
def users():
    print("users endpoint reached...")
    if request.method == "GET":
        with open("users.json", "r") as f:
            data = json.load(f)
            data.append({
                "username": "user4",
                "pets": ["hamster"]
            })

            return flask.jsonify(data)

    if request.method == "POST":
        received_data = request.get_json()
        print(f"received data: {received_data}")
        message = received_data['data']
        return_data = {
            "status": "success",
            "message": f"received: {message}"
        }
        return flask.Response(response=json.dumps(return_data), status=201) """


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
    word = request.data.decode()
    print(file)
    words = process_query(file, word)
    
    resp = {"success": True, "response": words}
    return flask.Response(response=json.dumps(resp), status=200)


if __name__ == "__main__":
    app.run("localhost", 6969)
