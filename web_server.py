import socket
import os
import datetime
import pytz
import json
import database_functions as db

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

def make_api_response(request_headers, request_body, client_connection):
    request_type = request_headers[0].split()[0]
    request_path = request_headers[0].split()[1]
    response_body=""
    print("request ",request_type, request_path)
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
        CODE = db.check_password(data['username'],data['password'])
        print(CODE)
        if CODE ==200:
            response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: session-token="+data["username"]+"; Path=/; Expires=Wed, 09 Nov 2026 10:18:14 GMT\r\n\r\n"
        else:
            response_header = f"HTTP/1.1 {CODE} "+response_codes[CODE]+"\r\n\r\n"
        response_body=''
        print("response header\n",response_header)
    elif request_path=="/api/login" and request_type == "DELETE":
        response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: session-token="+username+"; Path=/; Expires=Wed, 09 Nov 2020 10:18:14 GMT\r\n\r\n"
        response_body={}

    elif request_path=="/api/create-user" and request_type == "POST":
        user_check = db.check_user(data['username'])
        if user_check == None:
            response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
        elif user_check == True:
            worked2 = db.add_user(data['username'],data['password'])
            if worked2:
                response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\nSet-Cookie: session-token="+data["username"]+"; Path=/; Expires=Wed, 09 Nov 2026 10:18:14 GMT\r\n\r\n"
            else:
                response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
        else:
            response_header = "HTTP/1.1 409 "+response_codes[409]+"\r\n\r\n"
        response_body=''
    else:
        if request_type == "GET" and request_path == "/api/ownedStocks":
            response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\n\r\n"
            response_body = db.get_owned_stocks(username)
        if request_type == "POST" and request_path == "/api/searchStocks":
            response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\n\r\n"
            print("about to do search")
            response_body = db.search_stocks(data["input"])
        if request_type == "POST" and request_path == "/api/buyStock":
            balance = db.get_current_balance(data["username"])
            price = float(data["price"])
            quantity = int(data["quantity"])
            if balance<round((price*quantity),2):
                response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
                response_body = json.dumps({"reason":"insufficient funds"})
            else:
                response = db.buy_stock(data["stockID"], data["quantity"], data["price"], data["username"], balance)
                if response:
                    response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\n\r\n"
                else:
                    response_header = "HTTP/1.1 400 "+response_codes[400]+"\r\n\r\n"
                
                response_body = ""
        if request_type == "GET" and request_path == "/api/overviewInfo":
            response_header = "HTTP/1.1 200 "+response_codes[200]+"\r\n\r\n"
            cash = db.get_current_balance(username)
            print("done getting balance")
            moneyInStocks = db.get_money_in_stocks(username)
            print("done getting stockmoney")
            response_body = json.dumps({"cash":cash,"moneyInStocks":moneyInStocks})
            print("sent info", cash, moneyInStocks, response_header)
        
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
        modifiedTime = get_last_modified(path)
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
