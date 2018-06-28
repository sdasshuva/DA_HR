function numberField(a, b, c, d) {
    var blank = true;
    if(c)
        blank = false;
  return Ext.create('Ext.form.field.Number', {
    name: b,
    id: d,
    fieldLabel: a,
    filedAlign: 'top',
    allowBlank: blank,
    minValue: 0,
    value: 0,
    labelAlign: 'left',
    labelStyle: 'text-align:left;border solid 1px white;',
    labelSeparator: '',
    emptyText: 'Give '+a+'...',
    labelClsExtra: 'some-class',
    fieldStyle: 'text-align: left;font-size: 12px;',
    autoScroll: true
  });
}

function newNumberField(a, b, c) {
  return Ext.create('Ext.form.field.Number', {
    name: b,
    fieldLabel: a,
    id: c,
    filedAlign: 'top',
    allowBlank: true,
    width: 300,
    labelWidth: 120,
    minValue: 1,
    labelAlign: 'left',
    labelStyle: 'text-align:left;border solid 1px white;',
    labelSeparator: '',
    emptyText: 'Give '+a+'...',
    labelClsExtra: 'some-class',
    fieldStyle: 'text-align: left;font-size: 12px;',
    autoScroll: true
  });
}
