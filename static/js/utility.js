

var webchatutility = {
  checkValidUrl: null,
  getContentWidth: null,
  getColumnWidth: null,
  time_format: null,
  format_two_digits: null,
  format_am_pm: null,
  // for send event to parent window
  // parentAddress: "http://www.lifemagazine.com"
  parentAddress: "http://www.lifemagazine.com"
  // parentAddress: "http://192.168.1.23"
};


webchatutility.checkValidUrl = function(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  if (!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
};

webchatutility.getContentWidth = function(content) {
  return webchatutility.getColumnWidth('lifemagazine-chat-string-class', content);
};

webchatutility.getColumnWidth = function(columnClass, text) {
  tempSpan = $('<span id="tempColumnWidth" class="'+columnClass+'" style="display:none">' + text + '</span>').appendTo($('body'));
  columnWidth = tempSpan.width();
  tempSpan.remove();
  console.log(text + ', columnWidth: ' + columnWidth);
  return columnWidth;
};


webchatutility.time_format = function(d) {
    hours = d.getHours();
    minutes = webchatutility.ormat_two_digits(d.getMinutes());
    seconds = webchatutility.format_two_digits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds + webchatutility.format_am_pm(d.getHours());
};

webchatutility.format_two_digits = function(n) {
    return n < 10 ? '0' + n : n;
};

webchatutility.format_am_pm = function(n) {
    return n < 12 ? ' am' : ' pm';
};

function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function getStringDistance(s1, s2) {
  var baseStrLen = s1.length >= s2.length ? s1.length : s2.length;
  var longStrLen = s1.length + 1;
  var shortStrLen = s2.length + 1;
  var cost = new Array(longStrLen);
  var newcost = new Array(longStrLen);

  for (var i = 0; i < longStrLen; i++) {
    cost[i] = i;
  }

  for (var j = 1; j < shortStrLen; j++) {
    newcost[0] = j;

    for (var i = 1; i < longStrLen; i++) {
      var match = 0;
      if (s1.substr(i - 1, 1) != s2.substr(j - 1, 1)) {
        match = 1;
      }

      var replace = cost[i - 1] + match;
      var insert = cost[i] + 1;
      var remove = newcost[i - 1] + 1;

      newcost[i] = Math.min(Math.min(insert, remove), replace);
    }

    var temp = cost;
    cost = newcost;
    newcost = temp;
  }

  return (100 * ((baseStrLen - cost[longStrLen - 1]) / baseStrLen));
}


function getFormDateStr(dateStr) {
  var formDate = '';

  if (!dateStr) return dateStr;

  if (dateStr.length < 6 && dateStr.length != 6 && dateStr.length != 8 && dateStr.length != 12 && dateStr.length != 14) {
    return dateStr;
  }

  formDate = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2);
  if (dateStr.length >= 8) formDate += '-' + dateStr.substr(6, 2);
  if (dateStr.length >= 12) formDate += ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2);
  if (dateStr.length >= 14) formDate += ':' + dateStr.substr(12, 2);

  return formDate;
}

function getFormDateShort(dateStr) {
  var formDate = '';
  if(dateStr!=null) {
      formDate = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2) + ' ' + dateStr.substr(8, 2);
  }
  return formDate;
}
