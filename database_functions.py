import hashlib
import sqlite3
import random
import requests
from datetime import datetime
import json

def getAPIKey():
    with open("config.json", "r") as f:
        config = json.load(f)
    return config

api_key = getAPIKey()["api_key"]

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
        print(update)
        print(values)
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
        print("Database connection closed")
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
    results = get_userID_from_username(username)
    if results == None:
        return None
    elif results == "":
        return False
    else:
        return True
    
def get_owned_stocks(username):
    query = """SELECT stockID, ticker, name, quantity, lastModified
    FROM Users
    NATURAL JOIN BoughtStock
    NATURAL JOIN Stock

    WHERE username = ?
    """
    today = get_current_date()
    rows = queryDatabase(query,(username,))
    for i in range(len(rows)):
        rows[i]=list(rows[i])
        if rows[i][4] == str(today):
            price = queryDatabase("SELECT price FROM Prices WHERE stockID = ? and date = ?", (rows[i][0], str(today)))
            rows[i].append(price)
        else:
            price = set_stock_price(rows[i][0], rows[i][1], today)
            rows[i].append(price)
    jsonData = {}
    i=0
    while i<len(rows):
        jsonData[rows[i][0]]={"stockID":rows[i][0],"ticker":str(rows[i][1]),"name":str(rows[i][2]),"quantity":rows[i][3],"price":rows[i][5][0][0]}
        i+=1
    print("final Json data",jsonData)
    return json.dumps(jsonData)

def set_stock_price(stockID, ticker,today):
    endpoint = f'price?symbol={ticker}&apikey={api_key}'
    price = make_api_request(endpoint)["price"]
    updateDatabase("UPDATE Stock SET lastModified = ? WHERE stockID = ?", (today,stockID))
    updateDatabase("INSERT INTO Prices (date, stockID, price) VALUES (?,?,?)", (today,stockID,price))
    return price

def search_stocks(input):
    print("in search")
    query = """SELECT Stock.stockID, ticker, name, lastModified
    FROM Stock
    WHERE (ticker LIKE ? or name LIKE ?) and (country = "United States")
    LIMIT 5;
    """
    rows = queryDatabase(query, (f'%{input}%',f"%{input}%"))
    print("printing rows", rows)
    today = get_current_date()
    for i in range(len(rows)):
        rows[i]=list(rows[i])

        if rows[i][3]!=str(today):
            price = set_stock_price(rows[i][0], rows[i][1], today)
        else:
            row = queryDatabase("SELECT price FROM Prices WHERE stockID = ? and date = ?;", (rows[i][0], today))
            print("price row", row)
            price = row[0][0]
        rows[i].append(price)
    jsonData = {}
    i=0
    while i<len(rows):
        jsonData[rows[i][0]] = {"stockID":rows[i][0],"ticker":str(rows[i][1]),"name":str(rows[i][2]),"price":rows[i][4]}
        i+=1

    print("json string")
    print(jsonData)
    return json.dumps(jsonData)

def queryDatabase(query, values):
    conn = sqlite3.connect('stock_website.db')
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        rows = cursor.fetchall()

        # Process the results
        for row in rows:
            print("row from database",row)
    except sqlite3.Error as e:
        print(f"Error executing SELECT query: {e}")
        rows=None
    finally:
        cursor.close()
        conn.close()
        print("received message from database")
        return rows
    
def make_api_request(api_path):
    url="https://api.twelvedata.com/"+api_path
    response = requests.get(url).json() 
    return response

def get_current_date():
    current_date = datetime.now().strftime("%Y-%m-%d")
    today = datetime.strptime(current_date, "%Y-%m-%d")
    return today

def buy_stock(stockID, quantity, price, username, balance):
    print("buying stock")
    amount = round(int(quantity)*float(price), 2)
    newBalance = round(balance-amount,2)
    
    userID = get_userID_from_username(username)
    if userID == None or userID == "":
        return False
    else:
        updateDatabase("UPDATE Users SET money = ? WHERE username = ?", (newBalance,username))
        updateDatabase("INSERT INTO BalanceHistory (userID, date, cash, moneyInStocks)",(userID, get_current_date(),newBalance,get_money_in_stocks(username)))
        results = queryDatabase("SELECT quantity FROM BoughtStock WHERE userID = ? and stockID = ?", (userID,stockID))
        if not(results == None or len(results) == 0):
            quantity = quantity+results[0][0]
            updateDatabase("UPDATE BnoughtStock SET quantity = ? WHERE stockID = ? and userID = ?", (quantity, stockID, userID))
        else:
            updateDatabase("INSERT INTO BoughtStock (stockID, userID, quantity) VALUES (?,?,?)", (stockID,userID,quantity))

        return True


def get_current_balance(username):
    response = queryDatabase("SELECT money FROM Users WHERE username = ?",(username,))
    print("response", response, response[0][0], username)
    return response[0][0]

def get_userID_from_username(username):
    results = queryDatabase("SELECT userID FROM Users WHERE username = ?",(username,))
    print("userID", results)
    if results == None:
        name = None
    elif len(results) == 0:
        name = ""
    else:
        name = results[0][0]
    return name

def get_money_in_stocks(username):
    total= 0
    stocks = json.loads(get_owned_stocks(username))
    print("stocks bought", stocks)
    for stock in stocks:
        print(stock, stocks[stock]["price"])
        total += round(int(stocks[stock]["quantity"])*round(float(stocks[stock]["price"]),2),2)
    return total
