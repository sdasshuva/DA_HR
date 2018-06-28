function productionNavigation() {
    return Ext.create('Ext.tree.Panel', {
        region: 'north',
        title: 'Production',
        id: 'production_navigation',
        icon: '/uploads/icons/factory.png',
        collapsible: true,
        collapsed: false,
        rootVisible: false,
        autoScroll: true,
        border: false,
        store: {
            proxy: {
                type: 'ajax',
                api: {
                    read: '/line_tree'
                },
                reader: {
                    type: 'json',
                    root: 'children',
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
            itemclick: function(view, rec, item, index, eventObj) {
                var line = {};
                line.id = rec.data.id;
                line.name = rec.data.text;
                lineProductionTab(line)
            }
        }
    }).show();
}