$(function () {

        $('#testProgressBar').click(function() {
            testProgressBar();
        });



    $('#grid').w2grid({
        name: 'grid',
        show: {
            footer: true,
            lineNumbers : true,
            selectColumn: true
        },
        reorderColumns: true,
        columns: [
            { field: 'recid', caption: 'Rec. Id', size: '100%', resizable: true, hidden: true },
            { field: 'fname', caption: 'Full Name', size: '200px', resizable: true,
                render: function (record, index, column_index) {
                    var html = '<div>'+ record.fname + ' ' + record.lname + '</div>';
                    return html;
                }
            },
            { field: 'lname', caption: 'Last Name', size: '100%', resizable: true, hidden: true },
            { field: 'email', caption: 'Email', size: '100%', resizable: true },
            { field: 'profit',caption: 'Profit', size: '120px', render: 'money', resizable: true },
            { field: 'sdate', caption: 'Start Date', size: '120px', render: 'date', resizable: true }
        ],
        records: [
            { recid: 1, fname: 'John', lname: 'Doe', email: 'john@gmail.com', profit: 2500, sdate: '1/3/2012' },
            { recid: 2, fname: 'Stuart', lname: 'Motzart', email: 'stuart@gmail.com', profit: 1004, sdate: '4/13/2012' },
            { recid: 3, fname: 'Jin', lname: 'Franson', email: 'jin@gmail.com', profit: 473, sdate: '3/3/2012' },
            { recid: 4, fname: 'Susan', lname: 'Ottie', email: 'susan@gmail.com', profit: 304, sdate: '5/3/2012' },
            { recid: 5, fname: 'Kelly', lname: 'Silver', email: 'kelly@gmail.com', profit: 9300, sdate: '8/19/2012' },
            { recid: 6, fname: 'Francis', lname: 'Gatos', email: 'francis@gmail.com', sdate: '6/12/2012' },
            { recid: 7, fname: 'Mark', lname: 'Welldo', email: 'mark@gmail.com', profit: 3400, sdate: '8/13/2012' },
            { recid: 8, fname: 'Thomas', lname: 'Bahh', email: 'thomas@gmail.com', profit: 2030, sdate: '4/31/2012' },
            { recid: 10, fname: 'John', lname: 'Doe', email: 'john@gmail.com', profit: 13004, sdate: '1/3/2012' },
            { recid: 12, fname: 'Stuart', lname: 'Motzart', email: 'stuart@gmail.com', sdate: '4/13/2012' },
            { recid: 13, fname: 'Jin', lname: 'Franson', email: 'jin@gmail.com', profit: 4043, sdate: '3/3/2012' },
            { recid: 14, fname: 'Susan', lname: 'Ottie', email: 'susan@gmail.com', profit: 474, sdate: '5/3/2012' },
            { recid: 15, fname: 'Kelly', lname: 'Silver', email: 'kelly@gmail.com', profit: 1704, sdate: '8/19/2012' },
            { recid: 16, fname: 'Francis', lname: 'Gatos', email: 'francis@gmail.com', sdate: '6/12/2012' },
            { recid: 17, fname: 'Mark', lname: 'Welldo', email: 'mark@gmail.com', profit: 7065, sdate: '8/13/2012' },
            { recid: 18, fname: 'Thomas', lname: 'Bahh', email: 'thomas@gmail.com', profit: 609, sdate: '4/31/2012' },
            { recid: 19, fname: 'Sergei', lname: 'Rachmaninov', email: 'sergei@gmail.com', profit: 777, sdate: '2/23/2012' }
        ]
    });
});


function testProgressBar() {
    openApproveProgressBar();
}

function execute() {
    var recidArray = w2ui.grid.getSelection();
    var result = true;
    var totalCnt = recidArray.length;
    var currentCnt = 0;
    var failureCnt = 0;
    var jqxhr;

    recidArray.forEach(function(el, index, arr) {
        jqxhr = $.ajax({
            url: '/posttest',
            async: true,
            type: "POST",
            data : JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                console.log('update: ' );
            },
            error: function(err) {
                result = false;
                failureCnt++;
                console.log(err);
            }
        });

        jqxhr.complete(function() {
            currentCnt++;
            // moveProgressBar(totalCnt, currentCnt);
            setTimeout(moveProgressBar(totalCnt, currentCnt), 5);
        });
        // moveProgressBar(totalCnt, index + 1);
    });

}

function moveProgressBar(total, successCnt) {
    console.log('total: ' + total + ', successCn: ' + successCnt);
    var elem = document.getElementById("approveBar");
    var width = (successCnt * 100) / total;
    elem.style.width = width + '%';
    document.getElementById("approveLabel").innerHTML = width * 1  + '%';
}

function openApproveProgressBar() {
    console.log('openApproveProgressBar ');
    w2popup.open({
        title: '일괄 작업 진행률',
        body: '<br><div id="approveProgress"><div id="approveBar"><div id="approveLabel">10%</div></div></div>',
        buttons   : '<button class="btn" onclick="w2popup.close();">Close</button> ',
        width: 800,
        height: 150,
        onClose: function (event) { console.log('close'); }
    });

    setTimeout(execute, 1000);
}
