function workTimeInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Work Time',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [{
                xtype: 'timefield',
                name: 'in_time',
                emptyText: 'Select Time ...',
                fieldLabel: 'Time In',
                format: 'H:i:s (h:i A)',
                minValue: '6:00 AM',
                maxValue: '11:30 PM',
                increment: 30,
                anchor: '100%'
            }, {
                xtype: 'timefield',
                name: 'out_time',
                fieldLabel: 'Time Out',
                emptyText: 'Select Time ...',
                format: 'H:i:s (h:i A)',
                minValue: '6:00 AM',
                maxValue: '11:30 PM',
                increment: 30,
                anchor: '100%'
            }],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                handler: function() {
                    var success = false;
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        socket.emit('CreateWorkTime', values).on('CreateWorkTime', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('work_time_list_grid')) {
                                    Ext.getCmp('work_time_list_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                win.close();
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
                    }
                    if (success) {
                        this.up('.window').close();
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    this.up('.window').close();
                }
            }]
        })]
    }).show();
}