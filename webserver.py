#!/usr/bin/python3.9
"""
    Webserver test script:
    testing running a webserver using flask.

    Author Tim A.
"""

from flask import Flask
from flask import request
from flask import make_response
from flask import render_template
from flask import Markup
from flask_bootstrap import Bootstrap
import chess
import json

app = Flask(__name__, static_url_path='/static')
bootstrap = Bootstrap(app)


@app.route('/move')
def move():
    print(request.args.get('from', default=''))
    response = app.response_class(
                        response='test123 123 ',
                        status=200)
    return response

@app.route('/chess')
def chess():
    return render_template('index.html')

if __name__=="__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
