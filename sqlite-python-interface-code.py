import sqlite3

# Connect to an SQLite database (creates a new file if it doesn't exist)
conn = sqlite3.connect('stock_website.db')

# Create a cursor object to interact with the database
cursor = conn.cursor()

# # Create a table
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS users (
#         id INTEGER PRIMARY KEY,
#         name TEXT,
#         age INTEGER
#     )
# ''')

# # Insert data
cursor.execute('INSERT INTO Users (username,salt,passhash,money) VALUES (?,?,?,?)',('Brady','kwhrvkrvk','kwjbfouwbf',500))
# cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('Bob', 25))

# # Fetch data
# cursor.execute('SELECT userID FROM Users WHERE username = ?',('h'))
# rows = cursor.fetchall()
# print(rows)

# for row in rows:
#     print(row)

# Commit the changes
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()
