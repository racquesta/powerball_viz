#mLab login
# from mLab import username, password

#flask setup
from flask import Flask, render_template, redirect, jsonify
app = Flask(__name__)

#Mongo DB connection with mLab
from pymongo import MongoClient

client = MongoClient("mongodb://%s:%s@ds133816.mlab.com:33816/heroku_sdvkxt9m" % ("admin", "powerballdata")) 

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
    years = total_collection.find({}, {'date_format':1, '_id':0})
    list_years =[x['year'] for x in years]
    return jsonify(list_years)


@app.route("/jackpot")
def jackpot():
    pipe = [{'$group': {'_id': '$date_format', 'jackpot': {'$avg': '$jackpot'}, 'total_tickets_sold': {"$sum": '$ticket_sales'}}}]
    results = total_collection.aggregate(pipeline=pipe)
    # jackpot = [x['jackpot'] for x in results]
    # total_tick_sales = [x['total_tickets_sold'] for x in results]
    jackpot = []
    total_tick_sales = []
    for x in results:
        jackpot.append(x['jackpot'])
        total_tick_sales.append(x['total_tickets_sold'])
        
    # print(total_tick_sales)
    jackpots_dict = {
        "jackpots": jackpot,
        "ticket_sales": total_tick_sales
    }
    return jsonify(jackpots_dict)
if __name__ == '__main__':
    app.run(debug=True)