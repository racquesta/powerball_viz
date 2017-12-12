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
    pipe = [{'$group': {'_id': '$year', 'year': {'$first': '$year'}}}, {'$sort': {'_id': 1}}]
    results = total_collection.aggregate(pipeline=pipe)
    results_list = [x['year'] for x in results]
    return jsonify(results_list)

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
    print(results)
    state = []
    norm_draw = []
    norm_pp = []
    for x in results:
        state.append(x['_id'])
        norm_draw.append(x['norm_draw_sales'])
        norm_pp.append(x['norm_pp_sales'])
    
    sales_dict = {
        'state': state,
        'norm_draw': norm_draw,
        'norm_pp': norm_pp
    }

    return jsonify(sales_dict)

# unfinished route
@app.route("/bubble_data")
def bubble_data():
    results = total_collection.find({'year': {'$in': [2011, 2012, 2013, 2014, 2015]}}, {'date_format': 1, 
                                            'jackpot': 1, 
                                            'norm_tick_sales': 1, 
                                            'states': 1,
                                            'revenue': 1,
                                            'norm_revenue': 1,
                                            'Poverty Rate': 1,
                                            'Unemployment Rate': 1,
                                            'Household Income': 1,
                                            '_id': 0 })
    df = pd.DataFrame(list(results))
    df.dropna(inplace = True)
    df_dict = df.to_dict(orient = 'list')
    return jsonify(df_dict)




if __name__ == '__main__':
    app.run(debug=True)