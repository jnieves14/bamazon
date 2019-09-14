var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"password",
	database:"bamazon_db"
});

connection.connect(function(err){
	if(err)throw err;
	console.log("connected as id" + connection.threadId);
});

function displayList(){
    var query = "SELECT * FROM products";
	connection.query(query, function(err, res){
		if (err) throw err;
		var displayTable = new Table({
			head: ["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
			colWidths: [10,25,25,10,14]
		});
		for(var i = 0; i < res.length;i++){
			displayTable.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(displayTable.toString());
		inquirerUpdate();
	});
};

function inquirerUpdate(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Choose from the provided options to manage the current inventory:",
		choices: ["Restock Inventory", "Add A New Product", "Remove An Existing Product"]
	}]).then(function(answers){
		switch(answers.action){
			case "Restock Inventory":
				restockRequest();
				break;
			case "Add A New Product":
				addRequest();
				break;
			case "Remove An Existing Product":
				removeRequest();
				break;		
		}
	});
};

function restockRequest(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message: "Enter the item id of the product you'd like to restock."
	},
	{
		name: "Quantity",
		type: "input",
		message: "How many would like to restock?"
	},
	]).then(function(answers){
        var productID = answers.ID;
		var qtyadded = answers.Quantity;
		restockInventory(productID, qtyadded);
	});
};

function restockInventory(productID, qtyadded){
	connection.query("SELECT * FROM Products WHERE item_id = " + productID, function(err,res){
		if(err){console.log(err)};
        // connection.query('UPDATE Products SET stock_quantity = stock_quantity + ' + qtyadded + 'WHERE item_id =' + productID);
        connection.query("UPDATE Products SET ? WHERE ?", [
            {stock_quantity: (res[0].stock_quantity + parseInt(qtyadded))},
            {item_id: productID}
            ]);
		displayList();
	});
};

function addRequest(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message: "Add Item ID Number"

	},	
	{
		name: "Name",
		type: "input",
		message: "What is name of product you would like to stock?"
	},
	{
		name: "Department",
		type: "input",
		message: "What department does your product fall in?"
	},
	{
		name: "Price",
		type: "input",
		message: "What is the price for the product?"
	},
	{
		name: "Quantity",
		type: "input",
		message: "How many would like to add?"
	},

	]).then(function(answers){
		var id = answers.ID;
		var name = answers.Name;
		var department = answers.Department;
		var price = answers.Price;
		var quantity = answers.Quantity;
		addItem(id,name,department,price,quantity); 
	});
  };

function addItem(id,name,department,price,quantity){
  	connection.query("INSERT INTO products (item_id,product_name,department_name,price,stock_quantity) VALUES('" + id + "','" + name + "','" + department + "'," + price + "," + quantity +  ")");
  	displayList();
};

function removeRequest(){
  	inquirer.prompt([{
  		name: "ID",
  		type: "input",
  		message: "What is the item id of the item you would like to remove?"
  	}]).then(function(answer){
  		var id = answer.ID;
  		removeInventory(id); 
  	});
};

function removeInventory(id){
    connection.query("DELETE FROM Products WHERE item_id = " + id);
  	displayList();
};

displayList();
