var ajaxQueue = [];
var ajaxStamp = '';


// function ajax(url, method, params, callBack) {
// 	$.ajax({
// 		url: url,
// 		method: method,
// 		data: params,
// 		xhrFields: {withCredentials: true},
// 	})
// 	.done(callBack)
// 	.fail(function(jqXHR, textStatus) {
// 		noty({
// 			text: '서버 에러 발생!!\n서버와 통신하는 과정에서 에러가 발생했습니다.\n' + textStatus,
// 			type:"error",
// 			layout:"topRight"
// 		});
// 	})
// 	;
// }

function ajax(requestBody, callBack) {
	if (!requestBody.xhrFields) requestBody.xhrFields = {};
	requestBody.xhrFields.withCredentials = true;

	$.ajax(requestBody)
	.done(callBack)
	.fail(function(jqXHR, textStatus) {
		noty({
			text: '서버 에러 발생!!\n서버와 통신하는 과정에서 에러가 발생했습니다.\n' + textStatus,
			type:"error",
			layout:"topRight"
		});
	})
	;
}




function ajaxAllPages(url, method, params, callBack, before, after, stamp) {
	if (!stamp) {
		stamp = Date.now();
		ajaxQueue = [];
	}
	ajaxStamp = stamp;

	var pageNo = 0;
	var totalPages = 0;

	if (before) before();

	$.ajax({
		url: url,
		method: method,
		data: params,
		xhrFields: {withCredentials: true},
	})
	.done(function(data) {
		if(ajaxStamp != stamp) return;

		callBack(data);
		if (data.respData == null) {
			return;
		}
		pageNo = data.respData.pageNo;
		totalPages = data.respData.totalPages;

		if (totalPages - 1 > pageNo) {
			for (var i = pageNo + 1 ; i < totalPages  ; i++) {
				var cloneParams = clone(params);
				if (!cloneParams) cloneParams = {};
				cloneParams.page = i;
				addAjaxQueue(url, method, cloneParams, callBack, after, stamp);
			}
			runAjaxQueue();
		}
	})
	.fail(function(jqXHR, textStatus) {
		console.log(textStatus);
		noty({
			text: '서버 에러 발생!!\n서버와 통신하는 과정에서 에러가 발생했습니다.\n' + textStatus,
			type:"error",
			layout:"topRight"
		});
	})
	;
}

function addAjaxQueue(url, method, params, callBack, after, stamp) {
	ajaxQueue.push({
		url: url,
		method: method,
		params: params,
		callBack: callBack,
		after: after,
		stamp: stamp
	});
}

function runAjaxQueue(){
	var proc = ajaxQueue[0];
	ajaxQueue.splice(0, 1);

	ajaxQueueProc(proc.url, proc.method, proc.params, proc.callBack, proc.after, proc.stamp);

	function ajaxQueueProc(url, method, params, callBack, after, stamp) {
		$.ajax({
			url: url,
			method: method,
			data: params,
			xhrFields: {withCredentials: true},
		})
		.done(function(data) {
			if(ajaxStamp == stamp) {
				callBack(data);

				if (ajaxQueue && ajaxQueue.length > 0) {
					var proc = ajaxQueue[0];
					ajaxQueue.splice(0, 1);
					ajaxQueueProc(proc.url, proc.method, proc.params, proc.callBack, proc.after, proc.stamp);
				} else {
					if (after) after();
				}
			}
		})
		.fail(function(jqXHR, textStatus) {
			noty({
				text: '서버 에러 발생!!\n서버와 통신하는 과정에서 에러가 발생했습니다.\n' + textStatus,
				type:"error",
				layout:"topRight"
			});
		})
		;
	}
}



function getPageCnt(list, pageSize, currentPage) {
	if(!list || list.length <= 0) return;
	var totalPageCnt = Math.ceil(list.length / pageSize);
	var pageCnt = 7;
	if (totalPageCnt < pageCnt) pageCnt = totalPageCnt;
	if (currentPage > 1 && currentPage > totalPageCnt) currentPage = totalPageCnt;

	var fromPage = 1;
	if (currentPage > 3) fromPage = currentPage - Math.floor(pageCnt / 2);
	var toPage = fromPage + pageCnt - 1;
	if (toPage > totalPageCnt) {
		toPage = totalPageCnt
		fromPage = toPage - pageCnt + 1;
	}

	var pages = [];
	for (var i = fromPage ; i <= toPage ; i++) pages.push(i);

	return pages;
}
