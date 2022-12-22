function createTable() {
    // text is a string representation of a table
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
    if (string[-1] == 'x') {
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

function cleanTableNonActive() {
    var cells = createTable()
    var result = [];
    var labels = [];
  
    for (let i = 0; i < cells.length; i++) {
      var row = [];
      var label = '';
  
      for (let j = 0; j < cells[i].length; j++) {
        // Check if the cell is a number
        if (!isNaN(financeValue(cells[i][j]))) {
          // Add the cell to the row if it is a number
          row.push(cells[i][j]);
        } else {
          // Concatenate the cell to the label if it is not a number
          label += cells[i][j] + ' ';
        }
      }
  
      // Add the row and label to the result arrays if the row contains at least one number
      if (row.length > 0) {
        result.push(row);
        labels.push(label.trim());
      }
    }
  
    console.log(result)
    console.log(labels)
    return [labels, ...result]
  }

  function cleanTable() {
    var cells = createTable();
    var result = [];
    
    // Check if the "has-header" radio button is checked
    var hasHeader = document.getElementById("has-header").checked;
    
    for (let i = 0; i < cells.length; i++) {
    var row = [];
    
    let label = "";
    let numberFound = false;
    for (let j = 0; j < cells[i].length; j++) {
      // Check if the cell is a number
      if (!isNaN(financeValue(cells[i][j]))) {
        // Add the cell to the row if it is a number
        row.push(cells[i][j]);
        numberFound = true;
      } else {
        if (numberFound) {
          // Add the sublabel to the row
          row.push(cells[i][j]);
        } else {
          // Concatenate all of the words prior to the first number
          // and insert them into the first column of this array.
          label += cells[i][j] + ' ';
        }
      }
    }
    
    // Add the label to the row if it was found
    if (label.length > 0) {
      row.unshift(label.trim());
    }
    
    // Check if the row is a header row
    if (hasHeader && i === 0) {
      // Add the header row to the result array
      result.push(row);
    } else {
      // Add the row to the result array if it contains at least one non-whitespace element
      if (row.some((cell) => cell.trim().length > 0)) {
        result.push(row);
      }
    }
    }
    
    console.log(result);
    return result;
    }

function cleanTableArchive() {
    var cells = createTable()
    var result = [];

    for (let i = 0; i < cells.length; i++) {
        // Check if the row is empty
        if (cells[i].length === 0) {
            continue;
        }

        // Initialize variables for the label and values
        var label = '';
        var values = [];

        for (let j = 0; j < cells[i].length; j++) {
            // Check if the cell is a label
            if (isNaN(financeValue(cells[i][j]))) {
                // If the label is already set, this is a sublabel
                if (label) {
                    label += ' ' + cells[i][j];
                }
                // Otherwise, this is the main label
                else {
                    label = cells[i][j];
                }
            }
            // Otherwise, the cell is a value
            else {
                values.push(cells[i][j]);
            }
        }

        // If there are no values, this is a row with only a label
        if (values.length === 0) {
            result.push([label]);
        }
        // If there is a label, this is a row with a label and values
        else if (label) {
            result.push([label, ...values]);
        }
        // Otherwise, this is a row with only values
        else {
            result.push(['', ...values]);
        }
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

function generateTableNonActive(data) {
    // Flatten the data array and combine the labels and values into a single array
    data = [].concat(...data);
  
    // Find the maximum width of each column
    const columnWidths = data.reduce((widths, cell) => {
      cell.forEach((cell, index) => {
        widths[index] = Math.max(widths[index] || 0, cell.length);
      });
      return widths;
    }, []);
  
    // Create a row for each inner array in the data
    let tableString = '';
    for (const row of data) {
      // Add padding to the cells as needed to align the columns
      const paddedCells = row.map((cell, index) => cell.padEnd(columnWidths[index]));
      tableString += paddedCells.join(' | ') + '\n';
    }
  
    // Return the generated table string
    const inputField = document.getElementById("input-field")
    inputField.value = tableString;
  }

function generateTable(data) {

    // Find the maximum width of each column
    const columnWidths = data.reduce((widths, row) => {
        row.forEach((cell, index) => {
        widths[index] = Math.max(widths[index] || 0, cell.length);
        });
        return widths;
    }, []);

    // Create a row for each inner array in the data
    let tableString = '';
    for (const row of data) {
        // Add padding to the cells as needed to align the columns
        const paddedCells = row.map((cell, index) => cell.padEnd(columnWidths[index]));
        tableString += paddedCells.join(' | ') + '\n';
    }

    // Return the generated table string
    const inputField = document.getElementById("input-field")
    inputField.value = tableString;
  }

function generateTableArchive1(data) {
    // Create the table element
    const table = document.createElement('table');
  
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
  
    // Generate the table as a string using the innerHTML property
    const tableString = table.innerHTML;
  
    // Set the value of the input field to the generated table string
    const inputField = document.getElementById('input-field');
    inputField.value = tableString;
  }

function generateTableArchive(data) {
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

function clearContents() {
    var inputString = document.getElementById("input-string")
    var outputField = document.getElementById("input-field")
    inputString.value = ""
    outputField.value = ""
}