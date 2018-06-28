function attendanceReportGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'attendance_report_grid_' + rec.id,
        title: rec.name.toUpperCase(),
        //layout: 'fit',
        autoScroll: true,
        columnLines: true,
        //store: attendanceReportStore,
        store: {
            proxy: {
                type: 'ajax',
                url: '/attendance_report/' + rec.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('ATTENDANCE_REPORT_MODEL', {
                extend: 'Ext.data.Model',
                fields: attendance_report_model_field
            })
        },
        loadMask: true,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
            },
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {
                header: '#',
                width: 30
            }), {
                header: 'FP ID',
                dataIndex: 'id',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, parseInt(value));
                },
                flex: 0.5
            }, {
                header: 'EMPLOYEE NAME',
                dataIndex: 'first_name',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    var last_name = record.get('last_name');
                    return value + ' ' + last_name;
                },
                align: 'left',
                flex: 1
            },
            /*{
                header: 'SL TAKEN',
                dataIndex: 'sick_leave',
                align: 'left',
                flex: 0.5
            },
            {
                header: 'CL TAKEN',
                dataIndex: 'casual_leave',
                align: 'left',
                flex: 0.5
            },*/
            {
                header: 'PRESENT',
                dataIndex: 'present',
                align: 'left',
                flex: 0.5
            }, {
                header: 'ABSENT',
                dataIndex: 'absent',
                align: 'left',
                flex: 0.5
            }, {
                header: 'LATE',
                dataIndex: 'late',
                align: 'left',
                flex: 0.5
            }, {
                header: 'TOTAL',
                dataIndex: 'total',
                align: 'left',
                flex: 0.5
            }, {
                header: 'WEEKEND',
                dataIndex: 'weekend',
                align: 'left',
                flex: 0.5
            }, {
                header: 'HOLIDAY',
                dataIndex: 'holidays',
                align: 'left',
                flex: 0.5
            },
        ]
    });
}


var attendance_report_model_field = [{
    name: 'id',
    type: 'int'
}, {
    name: 'first_name',
    type: 'string'
}, {
    name: 'last_name',
    type: 'string'
}, {
    name: 'department',
    type: 'string'
}, {
    name: 'sick_leave',
    type: 'string'
}, {
    name: 'casual_leave',
    type: 'string'
}, {
    name: 'present',
    type: 'string'
}, {
    name: 'absent',
    type: 'string'
}, {
    name: 'late',
    type: 'string'
}, {
    name: 'weekend',
    type: 'string'
}, {
    name: 'holidays',
    type: 'string'
}, {
    name: 'total',
    type: 'string'
}, ]
for (var i = 1; i < 32; i++) {
    var attendance_report_model_day = {
        name: 'day_' + i,
        type: 'string',
        mapping: 'days.day_' + i
    }
    attendance_report_model_field.push(attendance_report_model_day)
};