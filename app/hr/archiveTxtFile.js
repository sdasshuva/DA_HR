function archiveTxtFileFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Upload New Archive Txt File',
        modal: true,
        layout: 'fit',
        items: [
            Ext.create('Ext.form.Panel', {
                width: '100%',
                bodyPadding: 20,
                border: false,
                items: [
                    newFileField('Archive File', 'archive_file'),
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
                            //console.log(form)
                            form.submit({
                                url: '/CreateArchiveAttendance',
                                waitMsg: 'Uploading your Audio file...',
                                success: function(fp, o) {
                                    success = true;
                                    win.close();
                                    Ext.MessageBox.alert('Success', 'Processed file "' + o.result.file + '" on the server');
                                }
                            });
                        } else {
                            fieldNames = [];
                            fields = panel.getInvalidFields();
                            for (var i = 0; i < fields.length; i++) {
                                field = fields[i];
                                fieldNames.push(field.getName());
                            }
                            console.debug(fieldNames);
                            Ext.MessageBox.alert('Invalid Fields', 'The following fields are invalid: ' + fieldNames.join(', '));
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
            })
        ]
    }).show();
}

function newFileField(a, b) {
  return Ext.create('Ext.form.field.File', {
    name: b,
    filedAlign: 'top',
    allowBlank: false,
    fieldLabel: a,
    width: 300,
    labelWidth: 80,
    labelAlign: 'left',
    labelStyle: 'text-align:left;border solid 1px white;',
    labelSeparator: '',
    emptyText: 'Give '+a+'...',
    clearOnSubmit: false,
    labelClsExtra: 'some-class',
    fieldStyle: 'text-align: left;font-size: 12px;',
    //buttonText: 'B',
    icon: '/uploads/icons/upload.png',
    listeners:{
        afterrender:function(cmp){
            cmp.fileInputEl.set({
                multiple:'multiple'
            });
        }
    },
    buttonConfig: {
        //'background-image': 'url(uploads/images/upload.png) !important',
    },
    /*listeners: {
        change: function (filefield, value) {
            'use strict';
            var newValue = value.replace(/(^.*(\\|\/))?/, "");
            filefield.setRawValue(newValue);
        }
    },*/
    //draggable: true,
    autoScroll: true
  });
}
