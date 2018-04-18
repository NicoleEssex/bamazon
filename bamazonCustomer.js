//node packages installed
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "test",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err, res){
    if(err) throw err;
    itemsForSale();
    
});

//function displaying all products for sale from bamazon database
function itemsForSale() {
    connection.query("SELECT id, product_name, price FROM products", function(err, res){
        if(err) throw err;
        for (var i = 0; i < res.length; i++){
            console.log("#" + res[i].id + " " + res[i].product_name + " $" + res[i].price);
        }
        productSearch();
    });
   
}

//function to prompt user what they want to buy
function productSearch() {
    inquirer
    .prompt([
        {
        name: "productId",
        type: "input",
        message: "What is the id of the product you'd like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
        name: "productQnt",
        type: "input",
        message: "How many would you like to purchase of this item?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
    ])
        .then(function(answer){
            connection.query("SELECT * FROM products WHERE ?", { id: answer.productId },function(err, res){
                if(err) throw err;
                for (var i = 0; i < res.length; i++){
                    if(res[i].stock_quantity - answer.productQnt > 0){
                        console.log("Your Total Amount due is: " + "$" + (res[i].price * answer.productQnt));
                        console.log("Thank you for your order!");
                        connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: res[i].stock_quantity - answer.productQnt}, {id: answer.productId}], function(err, res){
                            if(err) throw err;
                        });
                    }else{
                        console.log("I'm sorry due to low inventory we are unable to complete your order at this time.");
                    }  
                }
                itemsForSale();    
            });
        });
}





