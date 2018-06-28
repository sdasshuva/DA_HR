function workTimeTab() {
    if (Ext.getCmp('work_time_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("work_time_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Work Time',
            layout: 'fit',
            closable: true,
            id: 'work_time_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'work_time_list_grid',
                    // title: 'WORK TIME',
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/getWorkTime'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('WORK_TIME_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'name',
                                type: 'string'
                            }]
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
                        }
                    },
                    autoScroll: true,
                    columns: [{
                            header: 'CATEGORY',
                            dataIndex: 'name',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'IN TIME',
                            dataIndex: 'in_time',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'OUT TIME',
                            dataIndex: 'out_time',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'IN HOUR',
                            dataIndex: 'in_hour',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'IN MINUTE',
                            dataIndex: 'in_minute',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'IN LATE (M)',
                            dataIndex: 'in_late_allowed_minute',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'IN BONUS LATE (M)',
                            dataIndex: 'in_bonus_late_allowed_minute',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'OUT HOUR',
                            dataIndex: 'out_hour',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'OUT MINUTE',
                            dataIndex: 'out_minute',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'OUT LATE (M)',
                            dataIndex: 'out_late_allowed_minute',
                            align: 'center',
                            flex: 1
                        }, {
                            header: 'OUT BONUS LATE (M)',
                            dataIndex: 'out_bonus_late_allowed_minute',
                            align: 'center',
                            flex: 1
                        },
                        // {
                        //   xtype:'actioncolumn',
                        //   header: ' ',
                        //   width:25,
                        //   align: 'center',
                        //   items: [
                        //     {
                        //       icon: '/uploads/icons/delete.png',
                        //       tooltip: 'Delete',
                        //       handler: function(grid, rowIndex, colIndex) {
                        //         var rec = grid.getStore().getAt(rowIndex);
                        //         socket.emit('DestroyWorkTime', rec.id).on('DestroyWorkTime', function (message) {
                        //           if (message == "success") {
                        //             if(Ext.getCmp('work_time_list_grid')){
                        //               Ext.getCmp('work_time_list_grid').getStore().load();
                        //             }
                        //             Ext.MessageBox.alert('success', 'Successfully data deleted');
                        //           } else if(message == "error") {
                        //             Ext.MessageBox.alert('Error', 
                        //               'Please contact with the developer');
                        //           } else {
                        //             Ext.MessageBox.alert('Unauthorized',
                        //               'You are not authorized to perform this task. ' +
                        //               'Repeatedly doing this might block your ID');
                        //           }
                        //         });
                        //       }
                        //     }
                        //   ]
                        // }
                    ]
                })
            ],
            // tbar:[
            //   {
            //     xtype: 'button',
            //     icon: '/uploads/icons/create.png',
            //     text: 'Add New',
            //     border: 1,
            //     style: {
            //       borderColor: 'blue',
            //       borderStyle: 'solid'
            //     },
            //     handler: function () {
            //       workTimeInputFormWindow();
            //     }
            //   }
            // ],
            bbar: [{
                xtype: 'button',
                text: 'Reload',
                icon: '/uploads/icons/refresh.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    if (Ext.getCmp('work_time_list_grid')) {
                        Ext.getCmp('work_time_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}