DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(100) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;


-- option to use a .csv file and import to mySQL instead of code below

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES  (1, "matcha tea packet", "teas", 10.99, 100), 
        (2, "chai latte mix", "teas", 7.99, 100), 
        (3, "royal milk tea powder", "teas", 5.99, 50),
        (4, "sunflowers(dozen)", "garden", 16.99, 50), 
        (5, "potted succulent", "garden", 10.00, 50), 
        (6, "Chinese evergreen", "garden", 28.99, 35),
        (7, "washi tape", "stationery", 2.99, 25), 
        (8, "caligraphy pens(3pk)", "stationery", 8.99, 25), 
        (9, "sticker pack", "stationery", 7.00, 10),
        (10,"assorted cookies", "snacks", 6.99, 50);