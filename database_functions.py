import hashlib
import sqlite3
import random
import requests
from datetime import datetime
import json

api_key = '0e69e8d307994dbb91e844a7c5dd7b9a'
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def add_user(username, password):
    chars=[]
    for i in range(16):
        chars.append(random.choice(ALPHABET))
    salt="".join(chars)
    h = hashlib.sha256()
    h.update(password.encode())
    h.update(salt.encode())
    passhash = h.hexdigest()
    insert='INSERT INTO Users (username,salt,passhash,money) VALUES (?,?,?,?)'
    
    return updateDatabase(insert,(username,salt,passhash,500))
    
def updateDatabase(update, values):
    worked=True
    conn = sqlite3.connect('stock_website.db')
    cursor = conn.cursor()
    try:
        cursor.execute(update,values)
        conn.commit()
        print("data commited")
    except KeyError:
        worked=False
    except sqlite3.Error as e:
        print(f"Error: {e}")
        worked=False
    finally:
        cursor.close()
        conn.close()
        return worked

def check_password(username,password):
    print(username,password)
    results = queryDatabase('SELECT passhash, salt FROM Users WHERE username = ?', (username,))
    print(results)
    if results==None:
        return 400
    elif results==[]:
        return 404
    else:
        stored_passhash = results[0][0]
        stored_salt = results[0][1]
        h = hashlib.sha256()
        h.update(password.encode())
        h.update(stored_salt.encode())
        new_hash = h.hexdigest()
        if new_hash == stored_passhash:
            return 200
        else:
            return 401
        
def check_user(username):
    results = queryDatabase("SELECT userID FROM Users WHERE username = ?",(username,))
    if results == None:
        return None
    elif results == []:
        return True
    else:
        return False
    
def get_owned_stocks(username):
    query = """SELECT stockID, ticker, name, quantity, lastModified
    FROM Users
    NATURAL JOIN BoughtStock
    NATURAL JOIN Stock
    WHERE username = ?
    """
    current_date = datetime.now().strftime("%Y-%m-%d")
    today = datetime.strptime(current_date, "%Y-%m-%d")
    rows = queryDatabase(query,(username,))
    for row in rows:
        if row[4]!=today:
            price = set_stock_price(row[0], row[1], today)
            row[4] = price
    json_string = "{"
    for i in rows:
        json_string=json_string+rows[i][1]+":{"
        json_string=json_string+"stockID:"+rows[i][0]+","
        json_string=json_string+f"ticker:{rows[i][1]},"
        json_string=json_string+f"name:{rows[i][2]},"
        json_string=json_string+f"quantity:{rows[i][3]},"
        json_string=json_string+f"price:{rows[i][4]}"
        json_string=json_string+"}"
        if i!=len(rows):
            json_string=json_string+","
    json_string=json_string+"}"
    print(json_string)
    return json.dumps(json_string)

def set_stock_price(stockID, ticker,today):
    endpoint = f'price?symbol={ticker}&apikey={api_key}'
    price = make_api_request(endpoint)
    updateDatabase("UPDATE Stocks SET lastModified ")
    updateDatabase("INSERT INTO Prices (date, stockID, price) VALUES (?,?,?)", (today,stockID,price))
    return price

def search_stocks(input):
    query = """SELECT stockID, ticker, name, price
    FROM Stock
    NATURAL JOIN StockPrice
    WHERE ticker LIKE %?% or name LIKE %?%
    LIMIT 5
    """
    rows = queryDatabase(query, (input,input))
    for row in rows:
        if row[3]==None:
            price = set_stock_price(row[0], row[1])
            row[3] = price
    json_string = "{"
    for i in rows:
        json_string=json_string+rows[i][1]+":{"
        json_string=json_string+"stockID:"+rows[i][0]+","
        json_string=json_string+f"ticker:{rows[i][1]},"
        json_string=json_string+f"name:{rows[i][2]},"
        json_string=json_string+f"price:{rows[i][3]}"
        json_string=json_string+"}"
        if i!=len(rows):
            json_string=json_string+","
    json_string=json_string+"}"
    print(json_string)
    return json.dumps(json_string)

def queryDatabase(query, values):
    conn = sqlite3.connect('stock_website.db')
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        rows = cursor.fetchall()

        # Process the results
        for row in rows:
            print(row)
    except sqlite3.Error as e:
        print(f"Error executing SELECT query: {e}")
        rows=None
    finally:
        cursor.close()
        conn.close()
        print("received message from database")
        return rows
    
def make_api_request(api_path):
    url="https://api.twelvedata.com"+api_path
    response = requests.get(url).json() 
    return response