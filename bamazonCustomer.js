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
    // displayList();
});

var displayList = function() {
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
    });
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
        purchaseComplete(idReq, quantityReq);
    });
};

function purchaseComplete(idReq, quantityReq) {
    connection.query("SELECT * FROM products WHERE item_id =" + idReq, function(err,res) {
        if (err) throw err;
        if (quantityReq <= res[0].stock_quantity) {
            // var totalCharged = res[0].price * quantityReq;
            var totalCharged = parseFloat(((res[0].price)*quantityReq).toFixed(2));
            console.log("You're in luck, we have your order in stock!");
            console.log("The total for your purchase of " + quantityReq + " " + res[0].product_name + " priced at $" + res[0].price + " each is $" + totalCharged + ".");

            // connection.query("UPDATE products SET stock_quantity = stock_quantity - " + quantityReq + "WHERE item_id = " + idReq);
            connection.query("UPDATE Products SET ? WHERE ?", [
                {stock_quantity: (res[0].stock_quantity - quantityReq)},
                {item_id: idReq}
                ]);
        } else {
            console.log ("Sorry, we do not have enough of " + res[0].product_name + " in stock.");
        };
        displayAgain();
    })

}

function displayAgain(){
    inquirer.prompt([{
      type: "confirm",
      name: "reply",
      message: "Would you like to purchase another item?"
    }]).then(function(ans){
      if(ans.reply){
        displayList();
      } else{
        console.log("See you next time!");
      }
    });
}

displayList();

// how do i restock?