function employeeLeaveDateWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'TAKEN LEAVE DATES',
        width: '20%',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.grid.Panel', {
                id: 'employee_leave_date_grid',
                loadMask: true,
                autoScroll: true,
                //selType: 'cellmodel',
                columnLines: true,
                width: '100%',
                height: 200,
                store: {
                    data: rec,
                    model: Ext.define('TEST_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }]
                    })
                },
                viewConfig: {
                    emptyText: 'No records',
                    autoDestroy: false
                },
                columns: [
                    Ext.create('Ext.grid.RowNumberer'), {
                        header: 'LEAVE TAKEN DATE',
                        dataIndex: 'date',
                        renderer: Ext.util.Format.dateRenderer('jS F, Y'),
                        align: 'center',
                        flex: 1
                    }, {
                        xtype: 'actioncolumn',
                        header: ' ',
                        width: 25,
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/delete.png',
                            tooltip: 'Delete',
                            handler: function(grid, rowIndex, colIndex) {
                                var win = this.up('.window');
                                var rec = grid.getStore().getAt(rowIndex);
                                if (acLvl > 600 && acLvl < 700) {
                                    Ext.MessageBox.alert('ERROR', 'Sorry You Dont Have The Excess.<br />Please Consult With The IT Department.<br /><small><b style="color:red">Repeatedly Doing Might Block Your Account</b></small>');
                                } else {
                                    socket.emit('DestroyLeaveDate', rec.id).on('DestroyLeaveDate', function(message) {
                                        if (message == "success") {
                                            win.close();
                                            if (Ext.getCmp('employee_leave_details_grid')) {
                                                Ext.getCmp('employee_leave_details_grid').getStore().load();
                                            }
                                            Ext.MessageBox.alert('success', 'Successfully data deleted');
                                        } else if (message == "error") {
                                            Ext.MessageBox.alert('Error',
                                                'Please contact with the developer');
                                        } else {
                                            Ext.MessageBox.alert('Unauthorized',
                                                'You are not authorized to perform this task. ' +
                                                'Repeatedly doing this might block your ID');
                                        }
                                    });
                                }
                            }
                        }]
                    }
                ]
            })
        ]
    }).show();
}