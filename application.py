import os
import functools
import operator
import requests
from models import *
from flask import Flask, render_template, request, redirect, url_for, session
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.config["SESSION PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

res_countries = requests.get("https://api.printful.com/countries")
data_countries = res_countries.json()


@app.route("/")
def index():
    session["added_flights"] = []
    session["returning"] = []
    return redirect(url_for('main'))


@app.route("/main")
def main():
    countries1 = map(lambda x: str(x["name"]) + " " + str(x["code"]),
                     data_countries["result"])
    countries2 = map(lambda x: str(x["name"]) + " " + str(x["code"]),
                     data_countries["result"])
    return render_template("index.html", countries1=countries1, countries2=countries2, added_flights=session["added_flights"], returning=session["returning"])


@app.route("/addflights", methods=["POST"])
def add_flights():
    flight_origin = request.form.get("origin-city")
    flight_destination = request.form.get("dest-city")
    if flight_origin == '' or flight_destination == '' or flight_origin == flight_destination:
        return redirect(url_for('error'))

    res_distance = requests.get("https://www.distance24.org/route.json?",
                                params={"stops": flight_origin+"|"+flight_destination})

    if res_distance.status_code != 200:
        return redirect(url_for('error'))

    flight = res_distance.json()

    if request.form.get('returning'):
        flight["distance"] *= 2
        session["returning"].append(1)
    else:
        session["returning"].append(0)

    session["added_flights"].append(flight)
    return redirect(url_for('main'))


@app.route("/removelast")
def remove_last():
    if session["added_flights"] == []:
        return redirect(url_for('index'))

    session["added_flights"].pop()
    return redirect(url_for('main'))


@app.route("/distances")
def get_distances():

    distances = map(lambda x: x["distance"], session["added_flights"])
    total_distance = functools.reduce(operator.add, distances)
    return total_distance


@app.route("/durations/<string:duration>")
def durations(duration):
    if session["added_flights"] == []:
        return redirect(url_for('error'))

    mode = duration
    if duration == 'hours':
        session["duration"] = get_distances() / 900
    elif duration == 'minutes':
        session["duration"] = get_distances() / 900 * 60
    elif duration == 'seconds':
        session["duration"] = get_distances() / 900 * 60 * 60
    return render_template("durations.html", added_flights=session["added_flights"], time=session["duration"], mode=mode)


@app.route("/error")
def error():
    return render_template("error.html")
