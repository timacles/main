#!/usr/bin/python3
"""
    Webserver test script:
    testing running a webserver using flask.

    Author Tim A.
"""



from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
