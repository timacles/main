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
import chess.svg

app = Flask(__name__)
bootstrap = Bootstrap(app)

@app.route('/')
def index():
    board = chess.Board("8/2K5/4B3/3N4/8/8/4k3/8 b - - 0 1")
    board2 = chess.svg.board(
     board,
     fill=dict.fromkeys(board.attacks(chess.E4), "#cc0000cc") | {chess.E4: "#000000cc"},
     #arrows=[chess.svg.Arrow(chess.E4, chess.F1, color="#0000cccc")],
     squares=chess.SquareSet(chess.BB_DARK_SQUARES & chess.BB_FILE_B),
     size=550,
     )

    piece = Markup(chess.svg.piece(chess.Piece.from_symbol("R"), size=50))   
    board2 = Markup(board2)
    return render_template('chess.html', 
                            chess=board2,
                            piece=piece, 
                            mimetype='image/svg+xml')


@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)


@app.route("/resp/<name>")
def index2(name):
    response = make_response('<h1>This document carries a cookie!</h1>')
    response.set_cookie('answer', '42')
    return response


if __name__=="__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
