  // needs to be set for each account
  const accessToken = 'Insert access token here'
  const publisherId = 'Insert publisher id here'

function pullJSON() {
  try{
    let dates = getDates() 
    let startDate = dates[0]
    let endDate = dates[1]

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sheet = ss.getActiveSheet();
    var url="https://api.awin.com/publishers/"+advertiserId+"/transactions/?startDate="+startDate+"T00%3A00%3A00&endDate="+endDate+"T00%3A00%3A00&timezone=UTC";     

      
    const headers = {
      'Authorization': 'Bearer ' + accessToken
    };

    const options = {
      'method': 'get',
      'muteHttpExceptions': true,
      'headers': headers
    };
    
    Logger.log(url)
    var response = UrlFetchApp.fetch(url, options); 
    var dataSet = JSON.parse(response.getContentText()); // parse the JSON
    // Logger.log(dataSet)
    // Logger.log(JSON.stringify(dataSet, null, 2))
    orderByDateDescending(dataSet)
    var rows = [];
    let data;

    for (i = 0; i < dataSet.length; i++) {
      data = dataSet[i];
      rows.push([data.transactionDate, data.commissionAmount.amount, data.saleAmount.amount]); //your JSON entities here
    }
    // dataRange = sheet.getRange(2, 1, rows.length, 3); // 3 Denotes total number of entites
    // dataRange.setValues(rows);

    var numRows = rows.length;
    var numCols = 3;
    sheet.insertRows(2, numRows); // Insert new rows at row 2
    sheet.getRange(2, 1, numRows, numCols).setValues(rows);


  }
  catch(error){
    Logger.log('An error occurred:' + error)
  }
}

function getDates() {
  var today = new Date();
  var start = new Date(today); // Create a new date object with the same date and time as today
  start.setDate(today.getDate() - 1); // yesterday
  
  // Format the dates as strings (e.g., "yyyy-MM-dd")
  let endDate = Utilities.formatDate(today, "GMT", "yyyy-MM-dd");
  let startDate = Utilities.formatDate(start, "GMT", "yyyy-MM-dd");
  Logger.log([startDate, endDate]);

  return [startDate, endDate]
}
function orderByDateDescending(json) {
  json.sort(function(a, b) {
    // Extract the date strings from each object
    var dateA = new Date(a.transactionDate);
    var dateB = new Date(b.transactionDate);

    // Compare the dates in descending order
    return dateB - dateA;
  });
  Logger.log(JSON.stringify(json, null, 2))
  return json;

}