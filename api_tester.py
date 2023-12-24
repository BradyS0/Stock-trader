import requests 
import sqlite3
api_key = '0e69e8d307994dbb91e844a7c5dd7b9a'
ticker = 'AAPL'
# url = f'https://api.twelvedata.com/price?symbol={ticker}&apikey={api_key}'
url = f'https://api.twelvedata.com/price?symbol={}'
response = requests.get(url).json() 
# print(response)

conn = sqlite3.connect('stock_website.db')
cursor = conn.cursor()
# print(response)
for i in range(len(response['data'])):
    try:
        print(i)
        
        print("|",response['data'][i]['symbol'],"|",response['data'][i]['name'],"|",response['data'][i]['currency'],"|",response['data'][i]['country'],"|",response['data'][i]['type'])
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


