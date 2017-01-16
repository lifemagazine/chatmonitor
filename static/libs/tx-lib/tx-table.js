// selector : table 선택자
// columns : 배열 형태의 칼럼 변수명 (예. ['reqNo', 'reqDt', 'userNm' ...]
// optArgs : 여러가지 옵션들...
function TxTable(selector, columns, optArgs) {
	this.table = $(selector);
	this.dataLst = [];
	this.columns = columns;
	this.pageSize = 5;
	this.pageCnt = 0;
	this.currentPage = 0;
	this.filterVal = null;


	if (optArgs && optArgs.pageSize && optArgs.pageSize > 0) this.pageSize = optArgs.pageSize;
	
	var that = this;



	this.setData = function setData(dataLst) {
		that.dataLst = [];
		for (var i = 0 ; i < dataLst.length ; i++) {
			that.dataLst.push(convrtTableData(dataLst[i], that.filterVal));
		}
		that.showData();
	};

	this.addData = function addData(data) {
		if (data instanceof Array) {
			for (var i = 0 ; i < data.length ; i++) {
				that.dataLst.push(convrtTableData(data[i], that.filterVal));
			}
		} else {
			that.dataLst.push(convrtTableData(data, that.filterVal));
		}
		that.showData();
	};

	this.setFilter = function setFilter(filterVal) {
		that.filterVal = filterVal.toUpperCase();
		if (that.filterVal.trim().length <= 0) that.filterVal = null;

		for (var i = 0; i < that.dataLst.length ; i++) {
			if (that.filterVal && that.dataLst[i].txTableDataDom.text().toUpperCase().indexOf(that.filterVal) < 0) {
				that.dataLst[i].txTableDataIsShow = false;
			} else {
				that.dataLst[i].txTableDataIsShow = true;
			}
		}

		that.showData();
	}

	this.showData = function showData() {
		that.pageCnt = getPageCnt(that.dataLst, that.pageSize);

		that.table.find('tbody').remove();
		that.table.append('<tbody></tbody>');
		if (that.currentPage >= that.pageCnt) that.currentPage = that.pageCnt - 1;
		if (that.currentPage < 0) that.currentPage = 0;
		var itemCount = -1;
		for (var i = 0 ; i < that.dataLst.length ; i++) {
			if (that.dataLst[i].txTableDataIsShow) itemCount ++;
			if (itemCount < that.currentPage * that.pageSize) continue;
			if (itemCount >= (that.currentPage + 1) * that.pageSize) break;

			if (that.dataLst[i].txTableDataIsShow) {
				var data = that.dataLst[i]
				that.table.find('tbody').append(data.txTableDataDom);
				
				function setClickEvent(index) {
					var data = that.dataLst[index];
					data.txTableDataDom.click(function(){optArgs.click(data);});
				}
				if (optArgs && optArgs.click) setClickEvent(i);
			}
		}

		setPagination(that.table, that.pageCnt, that.currentPage);
	};

	this.movePage = function movePage(toPage) {
		that.currentPage = toPage;
		that.showData();
		setPagination(that.table, that.pageCnt, that.currentPage);
	}

	this.moveBeforePage = function moveBeforePage() {
		if (that.currentPage == 0) return;
		var toPage = that.currentPage - 1;
		if (toPage < 0) toPage = 0;
		that.movePage(toPage);
	}

	this.moveNextPage = function moveNextPage() {
		if (that.currentPage == that.pageCnt - 1) return;
		var toPage = that.currentPage + 1;
		if (toPage >= that.pageCnt) toPage = that.pageCnt - 1;
		that.movePage(toPage);
	}

	function convrtTableData(data, filterVal) {
		data.txTableDataRefresh = function txTableDataRefresh() {
					var htmlStr = makeTrStr(data);
					data.txTableDataDom = $($.parseHTML(htmlStr));
					if (filterVal && htmlStr.toUpperCase().indexOf(filterVal) < 0) data.txTableDataIsShow = false;
					else data.txTableDataIsShow = true;
				};
		data.txTableDataRefresh();
		return data;
	}


	makeTrsStr = function makeTrsStr(dataLst) {
		var htmlStr = '';
		for (var i = 0 ; i < dataLst.length; i++) {
			var data = dataLst[i];
			htmlStr += makeTrStr(data);
		}

		return htmlStr;
	}

	makeTrStr = function makeTrStr(data) {
		var colCnt = that.table.find('th').length
		var htmlStr = '<tr>';
		for (var colI = 0 ; colI < colCnt ; colI++) {
			var colName = that.columns[colI];
			var colData = '';
			if (colName) colData = eval('data.' + colName);
			if (!colData && colData != 0) colData = '';

			htmlStr = htmlStr + '<td>' + colData + '</td>';
		}
		htmlStr = htmlStr + '</tr>';

		return htmlStr;
	};

	getPageCnt = function getPageCnt(dataLst, pageSize) {
		var visibleDataCnt = 0;
		for (var i = 0 ; i < dataLst.length ; i++) {
			if (dataLst[i].txTableDataIsShow) visibleDataCnt++;
		}
		var pageCnt = Math.ceil(visibleDataCnt / pageSize);
		return pageCnt;
	}

	setPagination = function setPagination(table, pageCnt, currentPage) {
		table.next('.pagination').remove();
		if (pageCnt > 0) {
			table.after(makePaginationStr(pageCnt, currentPage));
			var lis = table.next('.pagination').find('li');
			for (var i = 0 ; i < lis.length ; i++) {
				var li = $(lis[i]);
				
				if (li.text() == '<') {
					li.click(function() {that.moveBeforePage()});
				} else if (li.text() == '>') {
					li.click(function() {that.moveNextPage()});
				} else {
					li.click(function() {
						var pageNo = Number($(this).text()) - 1
						that.movePage(pageNo)}
					);
				}
			}
		}
	}

	makePaginationStr = function makePaginationStr(pageCnt, currentPage) {
		var paginationSize = 7;
		var htmlStr = '';

		var leftHtmlStr = '';
		var leftI = 0;
		for (var i = currentPage - 1 ; i >= 0 ; i--) {
			leftHtmlStr = '<li><a>' + String(i + 1) + '</a></li>' + leftHtmlStr;
			leftI++;
			if (leftI >= 3) break;
		}
		var rightHtmlStr = '';
		var rightI = 0;
		for (var i = currentPage + 1 ; i < pageCnt ; i++) {
			rightHtmlStr += '<li><a>' + String(i + 1) + '</a></li>';
			rightI++;
			if (leftI + rightI >= 6) break;
		}

		if (leftI + rightI < 6) {
			leftHtmlStr = '';
			leftI = 0;
			for (var i = currentPage - 1 ; i >= 0 ; i--) {
				leftHtmlStr = '<li><a>' + String(i + 1) + '</a></li>' + leftHtmlStr;
				leftI++;
				if (leftI + rightI >= 6) break;
			}
		}

		htmlStr = '<div class="pagination pagination-centered">';
		htmlStr += '<ul>';

		// if (currentPage > 0)
			htmlStr += '<li><a>&lt;</a></li>';
		
		htmlStr += leftHtmlStr;
		htmlStr += '<li class="active"><a>' + String(currentPage + 1) + '</a></li>';

		htmlStr += rightHtmlStr;

		// if (currentPage < pageCnt - 1)
			htmlStr += '<li><a>&gt;</a></li>';
	

		htmlStr += '</ul>';
		htmlStr += '</div>';

		return htmlStr;
	}
	


}