module.exports = function() {};



function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/time_duration', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        database.erpSeqLize.query('SELECT id, name FROM time_duration ORDER BY id ASC').complete(function(err, data) {
            res.send(data);
        });
    });

    app.get('/line_tree', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        database.erpSeqLize.query('SELECT id, name AS text, true AS leaf FROM line WHERE factory = 3 ORDER BY id ASC').complete(function(err, data) {
            res.send(data);
        });
    });

    app.get('/line_production/:LID', function(req, res) {
        var date = new Date();
        if (req.query.date)
            date = new Date(req.query.date);
        var returnData = [];
        var LID = req.params.LID;
        d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
        res.setHeader('Content-Type', 'application/json');
        database.erpSeqLize.query(
            "SELECT line_job.id, " +
            "buyer.name AS buyer, style.name AS style, line.name AS line, " +
            "purchase_order_no.po_no, line_job.input_date, line_job.output_date FROM line_job" +
            " RIGHT JOIN line ON line_job.line = line.id" +
            " RIGHT JOIN purchase_order_no ON line_job.po_no = purchase_order_no.id" +
            " RIGHT JOIN `order` ON purchase_order_no.`order` = `order`.id" +
            " RIGHT JOIN buyer ON `order`.buyer = buyer.id" +
            " RIGHT JOIN style ON `order`.style = style.id" +
            " WHERE line_job.line = " + LID +
            " AND line_job.input_date <= '" + d +
            "' AND line_job.output_date >= '" + d +
            "' ORDER BY line_job.id ASC;"
        ).complete(function(err, line_jobs) {
            async.each(line_jobs, function(line_job, cb_line_job) {
                var o = {};
                o.id = line_job.id;
                o.buyer = line_job.buyer;
                o.style = line_job.style;
                o.line = line_job.line;
                o.po_no = line_job.po_no;
                o.input_date = line_job.input_date;
                o.output_date = line_job.output_date;
                database.erpSeqLize.query(
                    "SELECT SUM(quantity) AS quantity " +
                    "FROM  hourly_production " +
                    "WHERE line_job = " + line_job.id + " " +
                    "AND hourly_production.date = '" + d + "'"
                ).complete(function(err, hp) {
                    o.quantity = hp[0].quantity;
                    database.erpSeqLize.query(
                        "SELECT SUM(quantity) AS total_quantity " +
                        "FROM  hourly_production " +
                        "WHERE line_job = " + line_job.id
                    ).complete(function(err, hpt) {
                        o.total_quantity = hpt[0].total_quantity;
                        returnData.push(o);
                        cb_line_job();
                    });
                });
            }, function(err) {
                if (err) {
                    throw err;
                }
                res.send(returnData);
            });
        });
    });

    app.get('/job_hourly_production/:JID/:JD', function(req, res) {
        var JID = req.params.JID;
        var JD = req.params.JD;
        var date = new Date(JD);
        d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        res.setHeader('Content-Type', 'application/json');
        database.erpSeqLize.query(
            "SELECT hourly_production.id, time_duration.name AS duration, hourly_production.date," +
            " hourly_production.quantity FROM hourly_production" +
            " RIGHT JOIN time_duration ON hourly_production.time_duration = time_duration.id" +
            " WHERE hourly_production.line_job = " + JID +
            " AND hourly_production.date = '" + d +
            "' ORDER BY time_duration.id ASC;"
        ).complete(function(err, data) {
            res.send(data);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyJobHourlyProduction', function(HPid) {
            database.erpSeqLize.query(
                "DELETE FROM hourly_production WHERE id=" + HPid
            ).complete(function(err, data) {
                socket.emit("DestroyJobHourlyProduction", 'success');
            });
        });

        socket.on('AddJobHourlyProduction', function(Job) {
            var date = new Date();
            d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            database.erpSeqLize.query(
                "INSERT INTO hourly_production (line_job, date, time_duration, quantity) " +
                "VALUES ('" + Job.line_job + "', '" + Job.date + "', '" + Job.time_duration + "', '" + Job.quantity + "')"
            ).complete(function(err, data) {
                socket.emit("AddJobHourlyProduction", 'success');
            });
        });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;