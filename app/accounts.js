// function accounts() {
//     return Ext.create('Ext.tree.Panel', {
//         region: 'north',
//         title: 'Accounts Section',
//         icon: '/uploads/icons/accounts.png',
//         collapsible: true,
//         collapsed: false,
//         autoScroll: true,
//         rootVisible: false,
//         border: false,
//         listeners: {
//             itemclick: function(s, r) {
//                 navigation_event(r.data.text);
//             },
//         },
//         root: {
//             text: 'Root',
//             expanded: true,
//             children: [{
//                 text: 'Search Employees',
//                 leaf: true
//             }, {
//                 text: 'Comparative Salary',
//                 leaf: true
//             }, {
//                 text: 'Salary Statement',
//                 leaf: true
//             }, {
//                 text: 'Bank Statement',
//                 leaf: true
//             }, {
//                 text: 'Overtime Statement',
//                 leaf: true
//             }, {
//                 text: 'Salary List',
//                 leaf: true
//             }, {
//                 text: 'Comparative Salary B',
//                 leaf: true
//             }, {
//                 text: 'Salary Statement B',
//                 leaf: true
//             }, {
//                 text: 'Disappointed Salary Statement',
//                 leaf: true
//             }, {
//                 text: 'Bank Statement B',
//                 leaf: true
//             }, {
//                 text: 'Overtime Statement B',
//                 leaf: true
//             }, {
//                 text: 'Salary List B',
//                 leaf: true
//             }, {
//                 text: 'Bonus Top Sheet',
//                 leaf: true
//             }, {
//                 text: 'Bonus Statement',
//                 leaf: true
//             }, {
//                 text: 'Bonus Bank Statement',
//                 leaf: true
//             }, {
//                 text: 'Compliance Bonus Statement',
//                 leaf: true
//             }, {
//                 text: 'Night Tiffin Report',
//                 leaf: true
//             }, {
//                 text: 'Overtime Report',
//                 leaf: true
//             }, {
//                 text: 'Overtime Summary',
//                 leaf: true
//             }, {
//                 text: 'Section Summary',
//                 leaf: true
//             }, {
//                 text: 'Monthly Payment',
//                 leaf: true
//             }, {
//                 text: 'Payment Summary',
//                 leaf: true
//             }, {
//                 text: 'Types Of Accounts',
//                 leaf: true
//             }, {
//                 text: 'Accounts Head',
//                 leaf: true
//             }, {
//                 text: 'Sub Head',
//                 leaf: true
//             }, {
//                 text: 'Voucher Type',
//                 leaf: true
//             }, {
//                 text: 'Voucher',
//                 leaf: true
//             }, {
//                 text: 'Test Report',
//                 leaf: true
//             }]
//         }
//     });
// }

function finance_navigation() {
    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'Finance',
        icon: '/uploads/icons/accounts.png',
        collapsible: true,
        collapsed: false,
        animate: true,
        rootVisible: false,
        autoScroll: true,
        border: false,
        store: {
            proxy: {
                type: 'ajax',
                api: {
                    read: '/getFinanceNavigationTree'
                },
                reader: {
                    type: 'json',
                    // root : 'children',
                    successProperty: 'success',
                    idProperty: 'id',
                },
            },
            root: {
                expanded: true,
                loaded: true,
            },
            autoLoad: true
        },
        listeners: {
            itemclick: function(s, r) {
                switch (r.data.text) {

                    // case "PLANNING BOARD":
                    //   planningBoardWindow();
                    //   break;

                    // default:
                    //   // console.log(r.data);
                    //   if(r.data.style)
                    //     brandStyleListTab(r.data.brand);
                    //   if(r.data.po)
                    //     brandPOListTab(r.data.brand);
                    //   // Ext.MessageBox.alert('Error', 'Something Went Wrong. \nPlease contact with the developer for further details.');
                }
            }
        }
    });
}