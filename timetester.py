from datetime import datetime

# Get the current date and time
current_datetime = datetime.now()
# Format the date as a string
date_string = current_datetime.strftime("%Y-%m-%d")
today = datetime.strptime(date_string, "%Y-%m-%d")


yesterday = datetime.strptime("2023-12-20","%Y-%m-%d")
print("Current date and time as string:", today, yesterday, today==yesterday)
