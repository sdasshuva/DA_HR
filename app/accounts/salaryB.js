function salaryTabB() {
  if (Ext.getCmp('salary_tab_b')) {
    tab_panel.setActiveTab(Ext.getCmp("salary_tab_b"));
  } else {
    var new_tab = tab_panel.add({
      title: 'Employee Salary List B',
      layout: 'fit',
      closable: true,
      id: 'salary_tab',
      autoScroll: false,
      items: [
        salaryListGridB()
      ],
      tbar:[
        Ext.create('Ext.form.field.Text', {
          name: 'fp_id',
          id: 'salary_list_fp_id_search_b',
          filedAlign: 'top',
          allowBlank: true,
          minValue: 1,
          labelAlign: 'left',
          labelStyle: 'text-align:left;border solid 1px white;',
          labelSeparator: '',
          emptyText: 'Give FP ID',
          labelClsExtra: 'some-class',
          fieldStyle: 'text-align: left;font-size: 12px;',
          autoScroll: true,
          listeners: {
            change: {
              fn: function (combo, value) {
                if(value){
                  if(Ext.getCmp('salary_list_grid_b')){
                    Ext.getCmp('salary_list_grid_b').setLoading(true);
                    salaryGridReloadB();
                  }
                }
              }
            }
          }
        }),
        {
          xtype:'button',
          text:'<big><b>SEARCH</b></big>',
          icon: '/uploads/icons/search.png',
          iconCls: 'add',
          name:'Search',
          tooltip:'Search',
          width:150,
          height:45,
          border: 2,
          style: {
            borderColor: 'blue',
            borderStyle: 'solid'
          },
          handler: function(){
            salaryGridReloadB();
          }
        }
      ],
      bbar:[
        {
          xtype:'button',
          text:'Reload',
          icon: '/uploads/icons/refresh.png',
          iconCls: 'add',
          name:'reload',
          tooltip:'Reload',
          border: 1,
          style: {
            borderColor: 'blue',
            borderStyle: 'solid'
          },
          handler: function(){
            salaryGridReloadB();
          }
        },
        {
          xtype:'button',
          text:'Download',
          icon: '/uploads/icons/upload.png',
          iconCls: 'add',
          name:'reload',
          tooltip:'Download Salary Details B',
          target: '_blank',
          hrefTarget: '_blank',
          border: 1,
          style: {
            borderColor: 'blue',
            borderStyle: 'solid'
          },
          handler: function(){
            var file_name = 'Employee_Salary_Report B';
            Ext.getCmp('salary_list_grid_b').setLoading(true);
            socket.emit('SalaryListPDFDownloadB', site_url, file_name).on('SalaryListPDFDownloadB', function (message) {
              if (message == "success") {
                Ext.getCmp('salary_list_grid_b').setLoading(false);
                Ext.MessageBox.alert({
                  title:'Salary List Report Download',
                  buttons: Ext.MessageBox.CANCEL,
                  msg: 'Please <a href="/uploads/pdf/'+file_name+'.pdf" download>click here</a> to confirm the file download',
                  animateTarget: 'mb4',
                  icon: Ext.MessageBox.QUESTION
                });
              } else if(message == "error") {
                Ext.MessageBox.alert('Error', 'Something really went wrong. \n Contact with the developer');
              }
            });
          }
        }
      ]
    });
    tab_panel.setActiveTab(new_tab);
  }
}