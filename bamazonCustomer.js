var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayList();
});

function displayList() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err,res) {
        if (err) throw err;
        var displayTable = new Table ({
            head: ["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
            colWidths: [10,25,25,10,14]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        purchaseRequest();
    })
}

function purchaseRequest() {
    inquirer.prompt([
        {
            name: "ID",
            type: "input",
            message: "Please enter the item ID of the product you would like to purchase.",
            filter: Number
        },

        {
            name: "Quantity",
            type: "input",
            message: "Please enter the quanity you would like to purchase.",
            filter: Number
        }
    ]).then(function(answers) {
        var idReq = answers.ID; 
        var quantityReq = answers.Quantity;
        purchaseComplete();
    });
};

// function purchaseComplete(id, quantity) {

// }