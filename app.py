#mLab login
# from mLab import username, password

#flask setup
from flask import Flask, render_template, redirect, jsonify
app = Flask(__name__)

#Mongo DB connection with mLab
from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://%s:%s@ds133816.mlab.com:33816/heroku_sdvkxt9m" % ("admin", "powerballdata")) 

db = client.heroku_sdvkxt9m

total_collection = db.total_collection
winners_collection = db.winners_collection
jackpots_collection = db.jackpots_collection

import pandas as pd
import numpy as np
# functions in other files for routes imported here


@app.route("/")
def home():
    # scrape_dict = total_collection.find({}, {'year':1, '_id':0})
    # list_years =[x['year'] for x in scrape_dict]
    # print(list_years)
    return render_template("index.html")


@app.route("/years")
def years():
    pipe = [{'$match': {'year': {'$in': [2010, 2011, 2012, 2013, 2014, 2015]}}}, {'$group': {'_id': '$year', 'year': {'$first': '$year'}}}, {'$sort': {'_id': 1}}]
    results = total_collection.aggregate(pipeline=pipe)
    results_list = [x['year'] for x in results]
    return jsonify(results_list)

@app.route("/jackpots/<chosen_year>/<data_point>/<dep_var>")
def jackpots(chosen_year, data_point, dep_var):    
    results = jackpots_collection.find({}, {data_point: 1, 
                                        dep_var: 1, 
                                        'jackpot_run_id': 1,
                                        'year': 1,
                                        'date_format': 1,
                                        'drawings_since_jackpot': 1,
                                        '_id': 0 })
    df = pd.DataFrame(list(results))
    if chosen_year != 'all':
        df = df[df['year'] == int(chosen_year)]
    df_dict = df.to_dict(orient = 'list')
    return jsonify(df_dict)

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

@app.route("/jackpots_all")
def jackpots_all():
    results = total_collection.find({}, {'jackpot': 1, 
                                        'ticket_sales': 1, 
                                        '_id': 0 }, {'$sort': {'ticket_sales': 1}})
    # jackpot = [x['jackpot'] for x in results]
    # total_tick_sales = [x['total_tickets_sold'] for x in results]
    jackpot = []
    total_tick_sales = []
    for x in results:
        jackpot.append(x['jackpot'])
        total_tick_sales.append(x['ticket_sales'])
        
    # print(total_tick_sales)
    jackpots_dict = {
        "jackpots": jackpot,
        "ticket_sales": total_tick_sales
    }
    return jsonify(jackpots_dict)

@app.route("/sales_data/<year>")
def sales_data(year):
    year = int(year)
    pipe = [{'$match': {'year': year}},{'$group': {'_id': '$states', 'norm_draw_sales': {'$sum': '$norm_draw_sale_by_state'}, 'norm_pp_sales': {"$sum": '$norm_pp_sale_by_state'} }}, {'$sort': {'_id': 1}}]
    results = total_collection.aggregate(pipeline=pipe) 
    
    df = pd.DataFrame(list(results))

    df.dropna(inplace = True)

    sales_dict = df.to_dict(orient = 'list')
    
    return jsonify(sales_dict)

# unfinished route
@app.route("/soc_data/<chosen_year>/<data_point>/<dep_var>")
def soc_data(chosen_year, data_point, dep_var):
    pipe =  [{"$match": {"$and" : [{'year': {"$in": [2011, 2012, 2013, 2014, 2015]}}, {"state_abbr": {"$ne": "VI"}}]}}, {'$group': {'_id': {'year': '$year', 'state': '$states'}, 'independent': {'$avg': ("$" + data_point)}, 
                                                                                    'dependent': {'$sum': ('$' + dep_var)}}}]
    results = total_collection.aggregate(pipeline=pipe)

    df = pd.DataFrame(list(results))

    df['year'] = 0
    df['state'] = ''
    for index, row in df.iterrows():
        year = int(row["_id"]['year'])
        state = row['_id']['state']
        df.set_value(index, 'year', year)
        df.set_value(index, 'state', state)
    if chosen_year != "all":
        df = df[df['year'] == int(chosen_year)]
    del df['_id']

    df.dropna(inplace = True)

    df_dict = df.to_dict(orient = 'list')
    return jsonify(df_dict)


if __name__ == '__main__':
    app.run(debug=True)