function dailyAttendanceWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Daily Attendance Report',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [Ext.create('Ext.form.field.Date', {
                    name: 'date',
                    id: 'dailyAttendanceReportDate',
                    fieldLabel: 'Report Date:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give Date...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                })
                //newDateField('Date:', 'date', 'dailyAttendanceReportDate')
            ],
            buttons: [{
                text: 'Send Mail',
                icon: '/uploads/icons/mail.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        success = true,
                        values = form.getValues();
                    if (form.isValid()) {
                        var ms = (values.date != '') ? new Date(values.date) : new Date();
                        values.file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
                        values.url = site_url;
                        values.folderLocation = site_url + 'uploads/pdf/';
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadDailyAttendanceReportPDF', values).on('DownloadDailyAttendanceReportPDF', function(r, v) {
                                if (r == 'success' && success) {
                                    socket.emit('SendDailyAttendanceReport', values, v).on('SendDailyAttendanceReportReturn', function(r) {
                                        if (r == 'success') {
                                            success = false,
                                                Ext.MessageBox.alert({
                                                    title: 'Mail Sending Successful',
                                                    buttons: Ext.MessageBox.CANCEL,
                                                    msg: 'Mail Successfully Sent',
                                                    animateTarget: 'mb4',
                                                });
                                        }
                                        panel.setLoading(false);
                                    });
                                }
                            });
                        }
                    }
                }
            }, {
                text: 'Download',
                icon: '/uploads/icons/dowload.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        var ms = (values.date != '') ? new Date(values.date) : new Date();
                        values.file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
                        values.url = site_url;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadDailyAttendanceReportPDF', values).on('DownloadDailyAttendanceReportPDF', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Daily Attendance Download',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                    animateTarget: 'mb4',
                                    icon: Ext.MessageBox.QUESTION
                                });
                                panel.setLoading(false);
                            });
                        }
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