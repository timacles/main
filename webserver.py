#!/usr/bin/python3.9
"""
    Webserver test script:
    testing running a webserver using flask.

    Author Tim A.
"""



from flask import Flask
from flask import request
from flask import make_response

app = Flask(__name__)

@app.route('/')
def index():
    user_agent = request.headers.get('User-Agent')
    tmlpt =  '''
            <h1>
                Hello welcome to my site!!! 
                <p>
                Type in a name for a secret message
            </h1>
           
                <p><p>
                Your browser is %s
                <p>
                %s
           ''' 
    site = tmlpt % (user_agent, request.remote_addr)        
    return site


@app.route("/resp/<name>")
def index2(name):
    response = make_response('<h1>This document carries a cookie!</h1>')
    response.set_cookie('answer', '42')
    return response

@app.route("/<name>")
def hello_world(name):
    return """  
                <h1><p>Hello %s, Shweta is a nice wife!</p>
                <p><p>Very pregnant though.
                <p> Danny is a good boy too!
           """ % name

if __name__=="__main__":
    app.run(host="0.0.0.0", port=80)
