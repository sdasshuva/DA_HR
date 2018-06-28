function overtimeSummaryWindow() {
  var updateSectionStack = [];
  var successSectionStack = [];
  var currentStackRow = 0;
  return Ext.create('Ext.window.Window', {
    title: 'Overtime Summary Statement',
    id: 'OverTimeSummaryWindow',
    modal: true,
    width: '50%',
    layout: 'fit',
    closable: false,
    draggable: false,
    resizable: false,
    tbar: [
      Ext.create('Ext.form.field.Date', {
        name: 'month_search',
	      id: 'OverTimeSummaryWindowMonthSearch',
	      border: 1,
	      style: {
	        borderColor: 'blue',
	        borderStyle: 'solid'
	      },
        filedAlign: 'top',
        allowBlank: false,
        editable : false,
        emptyText: 'Select Month',
        format : "M-Y",
        autoScroll: true,
        safeParse : function(value, format)  {
          var FDF = this.picker.value[0]+1+"/1/"+this.picker.value[1];
          return new Date(FDF);
        },
        createPicker: function() {
          var me = this,
          format = Ext.String.format;
          return new Ext.picker.Month({
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            showButtons: false,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
              scope: me,
              select: me.onSelect
            },
            keyNavConfig: {
              esc: function() {
                me.collapse();
              }
            }
          });
        },
      }),
      {
        text: 'Download',
        id: 'OverTimeSummarySectionDownloadButton',
        icon: '/uploads/icons/download.png',
	      border: 1,
	      style: {
	        borderColor: 'blue',
	        borderStyle: 'solid'
	      },
        formBind: true,
        handler: function () {
        	if(Ext.getCmp('OverTimeSummaryWindowMonthSearch').value){
        		var QUERY = {};
        		QUERY.date = new Date(Ext.getCmp('OverTimeSummaryWindowMonthSearch').value);
        		QUERY.date.setDate(10);
            QUERY.file_name = monthNames[QUERY.date.getMonth()]+'_'+QUERY.date.getUTCFullYear()+'_OverTime_Summary';
            QUERY.URL = site_url;
            Ext.getCmp('OverTimeSummaryWindow').setLoading(true);
            socket.emit('DownloadOverTimeSummary', QUERY).on('DownloadOverTimeSummary', function (r) {
              Ext.MessageBox.alert({
                title:'Overtime Summary Download',
                buttons: Ext.MessageBox.CANCEL,
                msg: 'Please <a href="/uploads/pdf/'+QUERY.file_name+'.pdf" download>click here</a> to confirm the file download',
                animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
              });
            	Ext.getCmp('OverTimeSummaryWindow').setLoading(false);
            });
          }else{
            Ext.MessageBox.alert({
              title:'Error!!  Leave This Earth',
              buttons: Ext.MessageBox.CANCEL,
              msg: 'Please Select A Month First',
              animateTarget: 'mb4',
              icon: Ext.MessageBox.QUESTION
            });
        	}
        }
      },
    ],
    bbar:[
      {
        xtype:'button',
        text:'UPDATE',
        id: 'OverTimeSummarySectionUpdateButton',
        icon: '/uploads/icons/update.png',
        iconCls: 'add',
        name:'reload',
        tooltip:'Update',
        border: 1,
        style: {
          borderColor: 'blue',
          borderStyle: 'solid'
        },
        handler: function(){
        	if(Ext.getCmp('OverTimeSummaryWindowMonthSearch').value){
        		var QUERY = {};
        		QUERY.date = new Date(Ext.getCmp('OverTimeSummaryWindowMonthSearch').value);
        		QUERY.date.setDate(10);
            Ext.getCmp('OverTimeSummarySectionDownloadButton').disable();
            Ext.getCmp('OverTimeSummarySectionUpdateButton').disable();
            Ext.getCmp('OverTimeSummarySectionCloseButton').disable();
            function myFLoopS(i){
              Ext.getCmp('OverTimeSummarySectionGrid').getStore().load({
                callback: function (rec, opr, suc) {
                	currentStackRow = rec[i].id;
            			Ext.getCmp('OverTimeSummarySectionGrid').getStore().load({
                    callback: function (r, o, p) {
		                	currentStackRow = 0;
				              QUERY.section = rec[i].id;
				              QUERY.overtimeArray = [1,2,3,4,5];
				              QUERY.statusArray = [1,2];
				              updateSectionStack.push(rec[i].id);
		                  socket.emit('UpdateOverTimeSummarySection', QUERY).on('UpdateOverTimeSummarySection'+QUERY.section, function (r) {
		                    successSectionStack.push(rec[i].id);
		                    Ext.getCmp('OverTimeSummarySectionGrid').getStore().load({
		                      callback: function (records, operation, success) {
		                        i++;
		                        if(i>records.length - 1){
		                          Ext.getCmp('OverTimeSummarySectionDownloadButton').enable();
		                          Ext.getCmp('OverTimeSummarySectionCloseButton').enable();
		                        }else{
		                          myFLoopS(i);
		                        }
		                      },
		                      scope: this
		                    });
		                  });
                    },
                    scope: this
                  });
                },
                scope: this
              });
            }
            myFLoopS(0);
        	}else{
            Ext.MessageBox.alert({
              title:'Error!!  Leave This Earth',
              buttons: Ext.MessageBox.CANCEL,
              msg: 'Please Select A Month First',
              animateTarget: 'mb4',
              icon: Ext.MessageBox.QUESTION
            });
        	}
        }
      },
      {
        xtype:'button',
        text:'CLOSE',
        id: 'OverTimeSummarySectionCloseButton',
        icon: '/uploads/icons/cross.png',
        iconCls: 'add',
        name:'reload',
        tooltip:'Update',
        border: 1,
        style: {
          borderColor: 'blue',
          borderStyle: 'solid'
        },
        handler: function(){
          Ext.getCmp('OverTimeSummaryWindow').close();
        }
      }
    ],
    items: [
      Ext.create('Ext.grid.Panel', {
        loadMask: true,
        autoScroll: true,
        id: 'OverTimeSummarySectionGrid',
        columnLines: true,
        width: '100%',
        height: 200,
        store: {
          fields: ['id', 'name'],
          proxy: {
            type: 'ajax',
            url: '/getSection/2'
          },
          autoLoad: true,
          autoSync: true
        },
        viewConfig: {
          emptyText: 'No records', 
          autoDestroy: false
        },
        columns: [
          Ext.create('Ext.grid.RowNumberer'),
          {
            header: 'SECTION NAME',
            sortable: false,
            dataIndex: 'name',
            align: 'left',
            flex: 1
          },
          {
            header: 'STATUS',
            sortable: false,
            dataIndex: 'id',
            align: 'canter',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
              if(currentStackRow===value){
                return '<b style="color:red;">LOADING..........</b>';
              }
              if(updateSectionStack.indexOf(value)!=-1){
                if(successSectionStack.indexOf(value)!=-1){
                  return '<b style="color:green;">SUCCESS..........</b>';
                }
              }else{
                return '<b style="color:blue;">WAITING..........</b>';
              }
            },
            flex: 1
          },
        ]
      })
    ]
  }).show();
}