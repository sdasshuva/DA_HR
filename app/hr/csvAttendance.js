function csvAttendanceFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Machine Dat File',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                newFileField('CSV File', 'user_file'),
            ],
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
                        form.submit({
                            url: '/CreateCSVAttendance',
                            waitMsg: 'Uploading your CSV file...',
                            success: function(fp, o) {
                                success = true;
                                win.close();
                                Ext.MessageBox.alert('Success', 'Processed file "' + o.result.file + '" on the server');
                            },
                            failure: function(fp, o) {
                                if (o.response.responseText == 'success') {
                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
                                } else {
                                    Ext.MessageBox.alert('error', 'There Is Problem With The File. <br />Please Contact With The Developer');
                                }
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