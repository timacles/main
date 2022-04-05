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
    return """<p>Hello, Shweta is a nice wife!</p>
<p><p>Very pregnant though.
</p></p>
"""

if __name__=="__main__":
    app.run(host="0.0.0.0", port=80)
