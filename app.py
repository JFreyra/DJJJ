from flask import Flask, render_template
import csv,pprint,json

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

@app.route("/")
def home():
    return render_template("home.html")

# @app.route("/upcase")
# def upcase():
#     data = request.args.get("text")
#     print data
    
#     time.sleep(5)
    
#     result = {'original':data,
#               'result':data.upper()
#     }
    
#     return json.dumps(result)
# will work on tonight - Julius

if(__name__ == "__main__"):
    app.debug = True #allows app to update without killing server
    app.run()
