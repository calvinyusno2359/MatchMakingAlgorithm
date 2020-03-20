// modules
const mysql = require('mysql');
let config = require("../config");

// Create connection
const db = mysql.createPool(config.dblogin);

function test(req, res) {
    let sql = 'SELECT * FROM agent';
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        console.log('Agents fetched...');
        res.send(results);
    });
}

// Add agent
function addAgent(req, res) {
    let entry = req.body;
    let sql = 'INSERT INTO agent SET ?';
    db.query(sql, entry, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log("Agent added...");
        res.json({ status: "success" });
    });
};

// Select agents
function selectAgents(req, res) {
    let sql = 'SELECT * FROM agent';
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        console.log('Agents fetched...');
        res.render('db', { data: results });
    });
};

// Select single agent
// function selectAgent(req, res) {
//     let sql = `SELECT * FROM agent WHERE id = '${req.params.id}'`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Agent fetched...');
//     });
// };

// Update agent, including skill tag
function updateAgent(req, res) {
    let entry = req.body;
    let sql = `UPDATE agent SET email = '${entry.email}', tag = '${entry.tag}' WHERE id = '${entry.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log('Agent updated...');
        res.json({ status: "success" });
    });
};

// Delete agent
function deleteAgent(req, res) {
    let sql = `DELETE FROM agent WHERE id = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log('Agent deleted...');
        res.json({ status: "success" });
    });
};

// exports
exports.test = test;
exports.addAgent = addAgent;
exports.selectAgents = selectAgents;
// exports.selectAgent = selectAgent;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
