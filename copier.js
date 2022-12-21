function runCode(expr) {
    return pyodide.runPython(expr)
}

function testPython() {
    
    var text = document.getElementById("input-string").value
    
    console.log(runCode(`
    import csv

    def say_hello():
        return "Hello! This website has initialised..."

    def process_object(obj):
        return obj


    def parse_table(text):
        lines = text.splitlines()
        reader = csv.reader(lines, delimiter = " ")
    
        for row in reader:
            print(row)
    
    say_hello()            

    `))

    console.log(runCode(`
    
    string = process_object(str("${text.replace('\n', ' [nr] ')}"))
    
    rows = string.split(' [nr] ')
    table = [[]]*len(rows)

    for i in range(0, len(rows)):
        table[i] = rows[i].split(' ')
    
    table

    `))

}

function createTable() {

    var text = document.getElementById("input-string").value
    var rows = text.split('\n')
    var cells = rows.map(row => row.match(/\S+/g))

    return cells
    
}

function financeValue(string) {
    // Handle negative numbers
    if (string[0] === '(') {
      string = string.slice(1, -1);
    }

    // Handle zeros
    if (string === '-' || string === '--' || string === '—' || string === '—-' || string === '——' || string === '——-') {
        return 0;
      }
  
    // Handle percentage values
    if (string.slice(-1) === '%') {
      string = string.slice(0, -1);
      return parseFloat(string) / 100;
    }
  
    // Handle currency abbreviations
    if (string.slice(-1) === 'k') {
      string = string.slice(0, -1);
      return parseFloat(string) * 1000;
    }
    if (string.slice(-1) === 'm') {
      string = string.slice(0, -1);
      return parseFloat(string) * 1000000;
    }
    if (string.slice(-1) === 'b') {
      string = string.slice(0, -1);
      return parseFloat(string) * 1000000000;
    }

    // Handle finance terms
    if (string.includes('x')) {
        // string is a multiple
        // remove the 'x' and any other characters such as parentheses and spaces
        string = string.replace(/[^\d.-]/g, '');
        return Number(string);
      }
      
      if (string.includes('bps') || string.includes('ppt')) {
        // string is a finance term
        // remove the finance term and any other characters such as parentheses and spaces
        string = string.replace(/[^\d.-]/g, '');
        return Number(string);
      }
  
    // Return value as a number
    return parseFloat(string);
  }  

// Function to return the number value of a financially formatted string
// Returns "string" if the input is a word or returns NaN when converted to a number
function financeValueArchive(string) {
    // Check if the string is a percentage
    let percentageRegex = /^.*-? *\d+(.\d+)? *% *$/;
    if (percentageRegex.test(string)) {
        // Remove the percentage sign and any leading or trailing spaces
        string = string.replace('%', '').trim();
        // Return the number value divided by 100
        return Number(string) / 100;
    }
    // Check if the string is a multiple
    let multipleRegex = /^.*-? *\d+(.\d+)? *x *$/;
    if (multipleRegex.test(string)) {
        // Remove the "x" and any leading or trailing spaces
        string = string.replace('x', '').trim();
        // Return the number value
        return Number(string);
    }
    // Check if the string is a currency value
    let currencyRegex = /^ *-? *[^\d+-.,E]{1,3} *\d+(.\d+)? *[^\d+-.,E]? *$/;
    if (currencyRegex.test(string)) {
        // Return the number value of the currency string
        return convertCurrencyToNumber(string);
    }
    // Check if the string is a number with parentheses
    let parenthesesRegex = /^ *\((-? *\d+(\.\d+)?)\) *$/;
    if (parenthesesRegex.test(string)) {
        // Remove the parentheses and any leading or trailing spaces
        string = string.replace(/[()]/g, '').trim();
        // Return the negative of the number value
        return -Number(string);
    }
    
    // If the string is not a percentage, multiple, or currency value, try converting it to a number
    let number = Number(string);
    // If the conversion to a number returns NaN, return "string"
    if (isNaN(number)) {
        return "string";
    }
    // Otherwise, return the number value
    return number;
}

// Helper function to convert a currency value string to a number
function convertCurrencyToNumber(string) {
    // Check if the string is a number abbreviation
    let abbreviationRegex = /[^\d+-.,E]+/;
    let abbreviation = string.match(abbreviationRegex);
    if (abbreviation) {
        // Remove the abbreviation and any leading or trailing spaces
        string = string.replace(abbreviation, '').trim();
        // Convert the abbreviation to a multiplier
        let multiplier = 1;
        switch (abbreviation[0]) {
            case 'k':
            case 'K':
            case 'thou':
            case 'Thou':
            case 'THOU':
                multiplier = 1000;
                break;
            case 'm':
            case 'M':
            case 'mil':
            case 'Mil':
            case 'MIL':
            case 'mn':
            case 'Mn':
            case 'MN':
                multiplier = 1000000;
                break;
            case 'b':
            case 'B':
            case 'bil':
            case 'Bil':
            case 'BIL':
            case 'bn':
            case 'Bn':
            case 'BN':
                multiplier = 1000000000;
                break;
            case 't':
            case 'T':
            case 'tril':
            case 'Tril':
            case 'TRIL':
            case 'tn':
            case 'Tn':
            case 'TN':
                multiplier = 1000000000000;
                break;
        }
        // Return the number value multiplied by the abbreviation multiplier
        return Number(string) * multiplier;
    }
    // Return the string as a number
    return Number(string);
}

function cleanTable() {
    var cells = createTable()
    var result = [];

    for (let i = 0; i < cells.length; i++) {
        var row = '';
        var count = 0 

        for (let j = 0; j < cells[i].length; j++) {

            console.log("Cell: "+cells[i][j]+" Number representation: "+financeValue(cells[i][j]))

            if (isNaN(financeValue(cells[i][j]))) {
                row += cells[i][j] + ' ';
            } else {
                result.push([row.trim(), ...cells[i].slice(j)]);
                break
            }

        }

        row = row.trim();

    }

    console.log(result)
    return result

}

function presentTable() {
    table = cleanTable()
    newTable = ""

    for (let i = 0; i < table.length; i++) {
        
        row = ""

        for (let j = 0; j < table[i].length; j++) {
            row += table[i][j] + " "
        }

        newTable += row.slice(0,-1) + "\n"

    }

    console.log(newTable.slice(0,-1))
    return newTable.slice(0, -1)

}

function generateTable(data) {
    // Create the table element
    const table = document.createElement('table');
    const outputField = document.getElementById('output-table');
  
    // Create a row for each inner array in the data
    for (const row of data) {
      const tr = document.createElement('tr');
  
      // Create a column for each item in the inner array
      for (const col of row) {
        const td = document.createElement('td');
        td.textContent = col;
        tr.appendChild(td);
      }
  
      // Add the row to the table
      table.appendChild(tr);
    }
  
    // Return the table element
    outputField.appendChild(table);
  }

function parseTable() {
    table = cleanTable()
    generateTable(table)
    
}

function downloadExcelArchive() {
    var table = createTable()
    var ws = XLSX.utils.aoa_to_sheet(table)
    var wb = XLSX.utils.book.new()

    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, "table.xlsx")
}

function downloadExcel() {
    table = cleanTable()

    // Create an empty workbook
    const wb = XLSX.utils.book_new();
  
    // Create a worksheet with no data
    const ws = XLSX.utils.aoa_to_sheet(table);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    // Generate the Excel file
    const data = new Blob([XLSX.write(wb, {bookType: 'xlsx', type: 'array'})], {type: 'application/octet-stream'});
  
    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = 'empty.xlsx';
    link.click();
  }