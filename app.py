#mLab login
from mLab import username, password

#flask setup
from flask import Flask, render_template, redirect, jsonify
app = Flask(__name__)

#Mongo DB connection with mLab
from pymongo import MongoClient

client = MongoClient("mongodb://%s:%s@ds133816.mlab.com:33816/heroku_sdvkxt9m" % (username, password)) 

db = client.heroku_sdvkxt9m

total_collection = db.total_collection

# functions in other files for routes imported here


@app.route("/")
def home():
    # scrape_dict = total_collection.find({}, {'year':1, '_id':0})
    # list_years =[x['year'] for x in scrape_dict]
    # print(list_years)
    return render_template("index.html")


@app.route("/test")
def reload():
    years = total_collection.find({}, {'year':1, '_id':0})
    list_years =[x['year'] for x in years]
    return jsonify(list_years)

if __name__ == '__main__':
    app.run(debug=True)