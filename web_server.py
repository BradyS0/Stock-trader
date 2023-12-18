import socket
import threading
import os
import datetime
import pytz
import json
import random
import hashlib
import sqlite3

currency_conversion={
    'EUR':1.47,
    'USD':1.34,
    'CAD':1
}

response_codes = {
    200:"OK",
    404:"Not Found",
    415:"Unsupported media type",
    423:"Locked",
    503:"Service unavailable",
    409:"Conflict",
    401:"Unauthorized",
    400:"Bad Request"
}

http_head = """HTTP/1.1 {}
Content-Length: {}
Content-Type: {}
Last-Modified: {}
Server: Braydon's A1 Server\r\n\r\n"""

lastUpdatedPattern = "%a, %d %b %Y %H:%M:%S %Z"

directory='website'

#fundtion uses path to get the contents and info of the requested file
def getContent(path, file):
    body=None
    
    #gets the file extension
    extension=file.split('.')[1]

    CODE=200
    if extension == 'txt':
        content_type ='text/plain'
    elif extension == 'html':
        content_type = 'text/html'
    elif extension == 'css':
        content_type = 'text/css'
    elif extension == 'json':
        content_type == 'application/json'
    elif extension == 'js':
        content_type = 'application/javascript'
    elif extension == 'svg':
        content_type ='image/svg+xml'
    elif extension == 'jpeg' or extension == 'jpg':
        content_type = 'image/jpeg'
    elif extension == 'png':
        content_type = 'image/png'
    elif file == 'favicon.ico':
        content_type = 'image/x-icon'
    else:                               #anything not in above list is unsupported
        CODE = 415
        content_type = 'text/html'
        body = "<html><body><h1>415 Error</h1><p>Unsupported media type</p></body></html>"

    #if we know the type, open and read as bytes
    if CODE != 415:
        with open(path, 'rb') as f:
            body = f.read()
        f.close()

    return content_type, body, CODE

def parse_http_request(request):
    print('\nfull request\n\n',request, '\n')
    headers, body = request.split('\r\n\r\n', 1)
    headers = headers.split('\r\n')

    return headers, body

def get_path_and_file(requested_path):
    path = os.getcwd()+"/"+directory+requested_path
    file = path.split("/")
    file = file[len(file)-1]

    #this tests if http request was a folder and if it was, does the folder have 
    #an index.html. if so send that
    if file == '' :
        files_in_dir = os.listdir(path)
        if 'index.html' in files_in_dir:
            file = 'index.html'
            path = path+'index.html'

    return path, file

def make_http_reponse(request_headers):
    #added this clause in case request is not formal http
    if len(request_headers[0].split()) >1:
        path, file = get_path_and_file(request_headers[0].split()[1])
    else:
        path, file = get_path_and_file(request_headers[0])

    #checks if file requested exists, if yes, parse and make response
    if os.path.exists(path) and file != '':
        content_type, body, CODE = getContent(path, file)
        modifiedTimestamp = os.path.getmtime(path)
        modifiedTime = datetime.datetime.fromtimestamp(modifiedTimestamp, tz=pytz.timezone("America/Winnipeg"))
        modifiedTime = modifiedTime.strftime(lastUpdatedPattern)
    else:#send 404 error and html to show on web browser
        body = "<html><body><h1>404 Error</h1><p>File not found</p></body></html>"
        content_type = "text/html"
        CODE=404
        modifiedTime="N/A"

    #puts values in header skeleton
    response_header=http_head.format(str(CODE)+" "+response_codes[CODE], len(body),content_type, modifiedTime, "")

    return response_header, body

def add_user(username, password):
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
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
    except KeyError:
        worked=False
    except sqlite3.Error as e:
        print(f"Error: {e}")
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

def make_api_response(request_headers, request_body, client_connection):
    request_type = request_headers[0].split()[0]
    request_path = request_headers[0].split()[1]
    response_body=""
    print(request_type, request_path)
    data = None
    response_header=None
    if not(request_path=="/api/login" and request_type == "POST"):
        for header in request_headers:
                if header.startswith("Cookie"):
                    username = header.split(":")[1].strip().split("=")[1]
    if request_type != "GET" and request_type != "DELETE":
        #when using safari, you have to recv again to get body. chrome sends both headers and body in first recv
        if request_body == "":
            for header in request_headers:
                if header.startswith("Content-Length"):
                    content_length = int(header.split(":")[1].strip())
                    break
            # Read the request body
            if content_length > 0:
                request_body = client_connection.recv(content_length).decode('utf-8')
        data = json.loads(request_body)
        print("DATA", data)
    if request_path=="/api/login" and request_type == "POST":
        CODE = check_password(data['username'],data['password'])
        print(CODE)
        if CODE ==200:
             response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: username="+data["username"]+"; Path=/; Expires=Wed, 09 Nov 2026 10:18:14 GMT\r\n\r\n"
        else:
            response_header = f"HTTP/1.1 {CODE} "+response_codes[CODE]+"\r\n\r\n"
        response_body=''
        print("response header\n",response_header)
    elif request_path=="/api/login" and request_type == "DELETE":
        response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: username="+username+"; Path=/; Expires=Wed, 09 Nov 2020 10:18:14 GMT\r\n\r\n"
        response_body=''

    elif request_path=="/api/create-user" and request_type == "POST":
        user_check = check_user(data['username'])
        if user_check == None:
            response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
        elif user_check == True:
            if add_user(data['username'],data['password']):
                response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: username="+data["username"]+"; Path=/; Expires=Wed, 09 Nov 2026 10:18:14 GMT\r\n\r\n"
            else:
                response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
        else:
            response_header = "HTTP/1.1 409 "+response_codes[409]+"\r\n\r\n"
        response_body=''
    else:
        print('a')
        # if request_type == "POST" and request_path=="/api/tweet":
        #     newKey = str(uuid.uuid4().hex)
        #     while newKey[0].isdigit():
        #         newKey = str(uuid.uuid4().hex)
        #     response_header, response_body = post(newKey, username, "SET", data)
        #     print(response_header)

        # elif len(request_path.split("/")) == 4 and request_type == "PUT":
        #     print("changeing")
        #     response_header, response_body = post(data["key"], username, "SET", data)
        # elif len(request_path.split("/")) == 4 and request_type == "DELETE":
        #     response_header, response_body = post(request_path.split("/")[3], username, "DELETE", "")
        # elif request_type == "GET" and request_path == "/api/tweet":
        #     get_tweets_request={"type":"GET-DB"}
        #     response_body = json.loads(talkToDatabase(json.dumps(get_tweets_request)))
        #     if response_body["success"] == True:
        #         response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\n\r\n"
        #         print(response_body)
        #         response_body = json.dumps(response_body["data"])
        #     else:
        #         response_header = "HTTP/1.1 503 "+response_codes[503]+"\r\n\r\n"
        #         response_body=""
        #     print("get posts response: ",response_body)

    return response_header, response_body

def make_http_reponse(request_headers):
    #added this clause in case request is not formal http
    if len(request_headers[0].split()) >1:
        path, file = get_path_and_file(request_headers[0].split()[1])
    else:
        path, file = get_path_and_file(request_headers[0])

    #checks if file requested exists, if yes, parse and make response
    if os.path.exists(path) and file != '':
        content_type, body, CODE = getContent(path, file)
        modifiedTimestamp = os.path.getmtime(path)
        modifiedTime = datetime.datetime.fromtimestamp(modifiedTimestamp, tz=pytz.timezone("America/Winnipeg"))
        modifiedTime = modifiedTime.strftime(lastUpdatedPattern)
    else:#send 404 error and html to show on web browser
        body = "<html><body><h1>404 Error</h1><p>File not found</p></body></html>"
        content_type = "text/html"
        CODE=404
        modifiedTime="N/A"

    #puts values in header skeleton
    response_header=http_head.format(str(CODE)+" "+response_codes[CODE], len(body),content_type, modifiedTime, "")

    return response_header, body

def get_last_modified(path):
    modifiedTimestamp = os.path.getmtime(path)
    modifiedTime = datetime.datetime.fromtimestamp(modifiedTimestamp, tz=pytz.timezone("America/Winnipeg"))
    modifiedTime = modifiedTime.strftime(lastUpdatedPattern)
    return modifiedTime

def handle_thread(client_connection:socket):
    request_headers, request_body = parse_http_request(client_connection.recv(4096).decode('utf-8'))
    if request_headers[0].split()[1].split('/')[1] != 'api' :
        print("making http request")
        response_header, response_body = make_http_reponse(request_headers)
        is_api_req = False
    else:
        print("making api request")
        response_header, response_body = make_api_response(request_headers, request_body, client_connection)
        is_api_req = True

    client_connection.sendall(response_header.encode())
    request_type = request_headers[0].split()[0]
    if request_type == 'GET' or (request_type=="POST" and is_api_req):
        if type(response_body) != bytes:
            response_body = response_body.encode()
        client_connection.sendall(response_body)
    client_connection.close()
   

HOST, PORT = '',8999
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((HOST, PORT))
server_socket.listen()
#PORT = server_socket.getsockname()[1]
print("Listening on port... ",PORT)
while(True):
    try:
        client_connection, _ = server_socket.accept()
        handle_thread(client_connection)
        # theThread = threading.Thread(target=handle_thread, args=(client_connection,))
        # theThread.start()
        # print("Running {} threads".format(threading.active_count()))

    except Exception as e:
        print(e)
