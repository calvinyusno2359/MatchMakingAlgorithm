// modules
let mysql = require('mysql');
let config = require("../config");
let matchmaker = require("./rainbow").matchmaker;

// Create connection
let db = mysql.createPool(config.dblogin);

// Populate agents
function populateAgents(req, res) {
    // will remove localhost and tinder-on-rainbow eventually
    if (req.headers.referer !== "https://localhost:8080/home" &&
        req.headers.referer !== "https://tinder-on-rainbow.herokuapp.com/home" &&
        req.headers.referer !== "https://match-made-on-rainbow.herokuapp.com/home") {
        res.send("Access Denied");
        return;
    }
    let sql = 'SELECT * FROM agent';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Agents fetched...');
        res.render('db', { data: result });
    });
};

// Add agent
function addAgent(req, res) {
    let entry = req.body;
    let sql = 'INSERT INTO agent SET ?';
    db.query(sql, [entry], async(err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else {
            await matchmaker.getAllAvailableAgent();
            console.log(matchmaker);
            console.log("Agent added...");
            res.status(200).send();
        }
    });
};

// Update agent, including skill tag
function updateAgent(req, res) {
    let entry = req.body;
    let sql = `UPDATE agent SET email = ${mysql.escape(entry.email)}, tag = ${mysql.escape(entry.tag)} WHERE id = ${mysql.escape(entry.id)}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            console.log("Agent updated...");
            res.status(200).send();
        }
    });
};

// Delete agent
function deleteAgent(req, res) {
    let sql = `DELETE FROM agent WHERE id = ${mysql.escape(req.params.id)}`;
    db.query(sql, async(err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            await matchmaker.getAllAvailableAgent();
            console.log(matchmaker);
            console.log("Agent deleted...");
            res.status(200).send();
        }
    });
};


// function getAgents(req, res) {
//     const tag = req.params.id
//     let sql = `SELECT id, matched_user, availability FROM agent WHERE tag = ${mysql.escape(tag)}`
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         res.json({ result: result });
//     })
// }

// function updateAgentAvailability(req, res) {
//     const id = req.params.id
//     let sql = `UPDATE agent SET availability = 0 WHERE id = ${mysql.escape(id)}`
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         res.json({ result: result });
//     })
// }

function adminLogin(req, res) {
    let credentials = req.body;
    let sql = `SELECT * FROM admin WHERE username = ${mysql.escape(credentials.username)} and password = ${mysql.escape(credentials.password)}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            res.status(550).send(); // Permission denied
        } else {
            res.status(200).send();
        }
    })
}

// exports
exports.populateAgents = populateAgents;
exports.addAgent = addAgent;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
// exports.getAgents = getAgents;
// exports.updateAgentAvailability = updateAgentAvailability;
exports.adminLogin = adminLogin;