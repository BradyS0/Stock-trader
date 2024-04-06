# Stock-trader
buy and sell stocks using real time stock info and a sqlite database to your hold stock, website, and user data.

## File breakdown
Python web_server.py - hosted on local machine, creates a socket that listens for http messages for websites and api calls
Python database_funtions.py holds code funtions called by web_server.py to talk to database.
Sqlite3 stock_website.db - database
HTML index.html - minimal structure of the website
JavaScript code.js - holds a funtions that make the website interactive/dynamic, including making xhr api requests

## How it works
At first you will need to create an account. My web server will use sha256 to hash your password with a salt to randomize each users hash. Both the salt and the hash is stored and used to check when logging in. You will then log in, where you can buy stocks. Now since im using a free api, I can only get 8 api stock price requests per minute. 

To run the program, run:
python web_server.py 

and it will run on port 8999 

it can be accessed by going to localport:8999 in a web browser