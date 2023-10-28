  // needs to be set for each account
  const accessToken = 'Insert access token here'
  const publisherId = 'Insert publisher id here'

function pullJSON() {
  try{
    let dates = getDates() 
    let startDate = dates[0]
    let endDate = dates[1]

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheets = ss.getSheets();
    let sheet = ss.getActiveSheet();
    let url="https://api.awin.com/publishers/"+advertiserId+"/transactions/?startDate="+startDate+"T00%3A00%3A00&endDate="+endDate+"T00%3A00%3A00&timezone=UTC";     

    const headers = {
      'Authorization': 'Bearer ' + accessToken
    };

    const options = {
      'method': 'get',
      'muteHttpExceptions': true,
      'headers': headers
    };
    
    let response = UrlFetchApp.fetch(url, options); 
    let dataSet = JSON.parse(response.getContentText()); // parse the JSON
    // Logger.log(JSON.stringify(dataSet, null, 2))
    orderByDateDescending(dataSet)
    let rows = [];
    let data;

    for (i = 0; i < dataSet.length; i++) {
      data = dataSet[i];
      rows.push([data.transactionDate, data.commissionAmount.amount, data.saleAmount.amount]); //your JSON entities here
    }
    let numRows = rows.length;
    let numCols = 3;
    sheet.insertRows(2, numRows); // Insert new rows at row 2
    sheet.getRange(2, 1, numRows, numCols).setValues(rows);
  }
  catch(error){
    Logger.log('An error occurred:' + error)
  }
}

function getDates() {
  let today = new Date();
  let start = new Date(today); // Create a new date object with the same date and time as today
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
    let dateA = new Date(a.transactionDate);
    let dateB = new Date(b.transactionDate);

    // Compare the dates in descending order
    return dateB - dateA;
  });
  Logger.log(JSON.stringify(json, null, 2))
  return json;

}