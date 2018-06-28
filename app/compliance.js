function compliance() {
    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'HR & Admin',
        icon: '/uploads/icons/user-admin.png',
        collapsible: true,
        collapsed: false,
        autoScroll: true,
        rootVisible: false,
        border: false,
        listeners: {
            itemclick: function(s, r) {

                switch (r.data.text) {
                    /***    ITEM LIST S      ***/
                    case "EMPLOYEE LIST":
                        comlianceEmployeeListTab();
                        break;
                    case "DAILY ATTENDANCE":
                        dailyComplianceAttendanceWindow();
                        break;
                    case "SALARY STATEMENT":
                        complianceROSalaryStatementWindow();
                        break;
                        /***    ITEM LIST E      ***/
                }
                navigation_event(r.data.text);
            },
        },
        root: {
            text: 'Root',
            expanded: true,
            children: [{
                text: 'EMPLOYEE LIST',
                leaf: true
            }, {
                text: 'DAILY ATTENDANCE',
                leaf: true
            }, {
                text: 'SALARY STATEMENT',
                leaf: true
            }]
        }
    }).show();
}