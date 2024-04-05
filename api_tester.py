import json
import requests 
import sqlite3

ticker = 'AAPL'
# url = f'https://api.twelvedata.com/price?symbol={ticker}&apikey={api_key}'
url = f'https://api.twelvedata.com/stocks'#price?symbol={}'
response = requests.get(url).json() 
# print(response)

def getAPIKey():
    with open("config.json", r) as f:
        config = json.loads(f)
    return config

api_key = getAPIKey()["api_key"]

conn = sqlite3.connect('stock_website.db')
cursor = conn.cursor()
# print(response)
for i in range(len(response['data'])):
    try:
        print(i)
        
        print("|",response['data'][i]['symbol'],"|",response['data'][i]['name'],"|",response['data'][i]['currency'],"|",response['data'][i]['country'],"|",response['data'][i]['type'], response['data'][i]['exchange'])
        cursor.execute(f'INSERT INTO Stock (ticker,name,currency,country,type) VALUES (?,?,?,?,?)',(response['data'][i]['symbol'],response['data'][i]['name'],response['data'][i]['currency'],response['data'][i]['country'],response['data'][i]['type']))
        conn.commit()
        
    except KeyError:
        conn.rollback()
        continue
    except sqlite3.IntegrityError:
        conn.rollback()
        continue

# Commit the changes


# Close the cursor and connection
cursor.close()
conn.close()


