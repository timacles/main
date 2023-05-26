#!/usr/bin/python3


from flask import Flask
from flask import request
from flask import make_response
from flask import render_template
from flask import Markup
from flask_bootstrap import Bootstrap
import chess
import chess.engine
import json
import asyncio
import stockfish

app = Flask(__name__, static_url_path='/static')
bootstrap = Bootstrap(app)

board = chess.Board("r1bqkbnr/p1pp1ppp/1pn5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4")

@app.route('/move')
def move():
    board_get = request.args.get('from', default='')
    board = chess.Board(board_get)
    print(board)
    response = app.response_class(
                        response=str(board),
                        status=200)
    return response

@app.route('/')
def main():
    return render_template('index.html')

if __name__=="__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
