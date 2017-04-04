from flask import Flask, render_template, request

import csv
import pprint
import random
import json

app = Flask(__name__)

# --dataInit() - Initializes data
#
# -opens/reads daylight csv from ./data
# -formats data from hours:minutes to minutes and
#  transposes the data into rows for months and columns for days
# -if data does not have a value for a given day
#  (day does not exist in that month), a 0 is put into formatted list

def dataInit():
    dataraw = []

    daylight = open('data/daylight.csv','rt')
    reader = csv.reader(daylight, delimiter=",")
    for row in reader:
        print row
        dataraw.append(row)

    dataformat = []
    for x in range(1,13):
        row = []
        for y in range(1,32):
            raw = dataraw[y][x] # transposing data
            tup = raw.split(":")
            if tup != ['']:
                raw = int(tup[0])*60 + int(tup[1])
            else:
                raw = 0 # not None type in case js does not recognize None
            row.append(raw)
        dataformat.append(row)

    return dataformat

# unusable as of now will fix - Julius
def dataJSFormat():
    dataMForm = dataInit()
    daylightF = []

    for i in range (0,len(dataMForm)):
        for j in range (0,len(dataMForm[i])):
            val = dataMForm[i][j];
            if val > 0:
                print val/1440.0
                val = val/1440.0
                if val in daylightF:
                    # Prevent duplicate values from being added
                    val += random.random()/1000.0
                daylightF.append(val)

    return daylightF

@app.route("/")
def home():
    month = (1./12)*100
    text = (1015./12)
    hour = (710./24)
    hourColor = (255/24)
    print(month)
    return render_template("home.html",gradPos=month,textPos=text,hour=hour,hourC=hourColor)

# AJAX
@app.route("/dataret",methods=['GET'])
def dataret():
    result = {
              'data': dataJSFormat()
    }

    return json.dumps(result)

if(__name__ == "__main__"):
    app.debug = True #allows app to update without killing server
    app.run()
