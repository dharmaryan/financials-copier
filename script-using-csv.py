import openpyxl as xl
import csv

# Parses a table structured as "label value value ..." 

def parse_table(text):
    lines = text.splitlines()
    reader = csv.reader(lines, delimiter = " ")

    for row in reader:
        print(row)

