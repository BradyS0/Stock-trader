import json


a = {{"stockID":"AAPL","name":"Apple"},{"stockID":"MICR","name":"Microsoft"},{"stockID":"INTL","name":"Intel"}}
a = json.loads
for i in a:
    print(i["stockID"])