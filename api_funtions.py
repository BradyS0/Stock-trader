import json

def getAPIKey():
    with open("config.json", r) as f:
        config = json.loads(f)
    return config

api_key = getAPIKey()
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def set_stock_price(stockID, ticker,today):
    endpoint = f'price?symbol={ticker}&apikey={api_key}'
    price = make_api_request(endpoint)["price"]
    updateDatabase("UPDATE Stock SET lastModified = ? WHERE stockID = ?", (today,stockID))
    updateDatabase("INSERT INTO Prices (date, stockID, price) VALUES (?,?,?)", (today,stockID,price))
    return price

