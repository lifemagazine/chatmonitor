function numFrmt(num, digit) {
	return ("0" + num).slice(-digit);
}

function preload() {
	var images = new Array()
	
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}

function LPAD(s, c, n) {    
	if (! s || ! c || s.length >= n) {
		return s;
	}

	var max = (n - s.length)/c.length;
	for (var i = 0; i < max; i++) {
		s = c + s;
	}

	return s;
}


function getTimeWithColon(timStr) {
	if (!timStr || timStr.length < 4) return '';
	return timStr.substring(0, 2) + ':' + timStr.substring(2, 4);
}

function getDateTimeWithSep(dateTimeStr) {
	if (!dateTimeStr || dateStr.length < 8) return '';
	else if (dateStr.length >= 8 && dateStr.length < 12) return getDateWithDot(dateTimeStr);
	else return getDateWithDot(dateTimeStr) + ' ' + getTimeWithColon(dateTimeStr.substring(8,12));
}

function getDateWithDot(dateStr) {
	if (!dateStr || dateStr.length < 8) return '';
	return dateStr.substring(0, 4) + '.' + dateStr.substring(4, 6) + '.' + dateStr.substring(6, 8);
}

function getDayStrByDate(date) {
	var dateStr = String(date);
	
	if (dateStr.length < 8) return '';
	
	var year = Number(dateStr.substring(0, 4));
	var month = Number(dateStr.substring(4, 6));
	var day = Number(dateStr.substring(6, 8));
	
	var dt = new Date(year, month - 1, day);
	
	return getDayStrEn(dt.getDay());
}

function getDayStr(day) {
	switch (day) {
		case 0 : return '일';
		case 1 : return '월';
		case 2 : return '화';
		case 3 : return '수';
		case 4 : return '목';
		case 5 : return '금';
		case 6 : return '토';
		default : return '';
	}
}

function getDayStrEn(day) {
	switch (day) {
		case 0 : return 'Sun';
		case 1 : return 'Mon';
		case 2 : return 'Tue';
		case 3 : return 'Wed';
		case 4 : return 'Thu';
		case 5 : return 'Fri';
		case 6 : return 'Sat';
		default : return '';
	}
}

function getDateStr(dateStr) {
	if (!dateStr || dateStr.length < 8) return '';
	var year = dateStr.substring(0, 4);
	var month = dateStr.substring(4, 6);
	var date = dateStr.substring(6, 8);
	
	var dt = new Date(year, Number(month) - 1, date);
	var day = getDayStrEn(dt.getDay());
	
	return year + '.' + month + '.' + date + ' (' + day + ')';
}


function getDateShrtStr(dateStr) {
	if (!dateStr || dateStr.length < 8) return '';
	var year = dateStr.substring(0, 4);
	var month = dateStr.substring(4, 6);
	var date = dateStr.substring(6, 8);
	
	var dt = new Date(year, Number(month) - 1, date);
	var day = getDayStrEn(dt.getDay());
	
	return month + '.' + date + '(' + day + ')';
}


function clone(obj){
	var clonedObjectsArray = [];
	var originalObjectsArray = []; //used to remove the unique ids when finished
	var next_objid = 0;

	function objectId(obj) {
		if (obj == null) return null;
		if (obj.__obj_id == undefined){
			obj.__obj_id = next_objid++;
			originalObjectsArray[obj.__obj_id] = obj;
		}
		return obj.__obj_id;
	}

	function cloneRecursive(obj) {
		if (null == obj || typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean") return obj;

		// Handle Date
		if (obj instanceof Date) {
			var copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0; i < obj.length; ++i) {
				copy[i] = cloneRecursive(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			if (clonedObjectsArray[objectId(obj)] != undefined)
				return clonedObjectsArray[objectId(obj)];

			var copy;
			if (obj instanceof Function)//Handle Function
				copy = function(){return obj.apply(this, arguments);};
			else
				copy = {};

			clonedObjectsArray[objectId(obj)] = copy;

			for (var attr in obj)
				if (attr != "__obj_id" && obj.hasOwnProperty(attr))
					copy[attr] = cloneRecursive(obj[attr]);                 

			return copy;
		}       
		throw new Error("Unable to copy obj! Its type isn't supported.");
	}
	
	var cloneObj = cloneRecursive(obj);
	
	//remove the unique ids
	for (var i = 0; i < originalObjectsArray.length; i++){
		delete originalObjectsArray[i].__obj_id;
	};

	return cloneObj;
}


/**
 * URL 파라미터를 추출해서 반환한다.
 * @return {[type]} [description]
 */
function getUrlParams() {
	// 파라미터가 담길 배열
	var param = new Array();

	// 현재 페이지의 url
	var url = decodeURIComponent(location.href);
	// url이 encodeURIComponent 로 인코딩 되었을때는 다시 디코딩 해준다.
	url = decodeURIComponent(url);

	var params;
	// url에서 '?' 문자 이후의 파라미터 문자열까지 자르기
	params = url.substring( url.indexOf('?')+1, url.length );
	// 파라미터 구분자("&") 로 분리
	params = params.split("&");

	// params 배열을 다시 "=" 구분자로 분리하여 param 배열에 key = value 로 담는다.
	var size = params.length;
	var key, value;
	for(var i=0 ; i < size ; i++) {
		key = params[i].split("=")[0];
		value = params[i].split("=")[1];

		param[key] = value;
	}

	return param;
}



function dateAdd(date, interval, units) {
	var ret = new Date(date); //don't change original date
	switch(interval.toLowerCase()) {
		case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
		case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
		case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
		case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
		case 'day'    :  ret.setDate(ret.getDate() + units);  break;
		case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
		case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
		case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
		default       :  ret = undefined;  break;
	}
	return ret;
}



function formatMoney(money) {
	var parts = String(money).split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}