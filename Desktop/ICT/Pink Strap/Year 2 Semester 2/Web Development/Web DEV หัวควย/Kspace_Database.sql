CREATE DATABASE `Kspace`;

CREATE TABLE Product(
	product_ID INT ,
    product_Category NVARCHAR(160) ,
    Name NVARCHAR(100) NOT NULL ,
	label NVARCHAR(100) NOT NULL ,
    price DECIMAL(10, 2) NOT NULL ,
    artist NVARCHAR(100) ,
    release_date date ,
    quantity INT ,
    Product_Image VARCHAR(255) ,
    admin_ID INT ,
    CONSTRAINT PK_product primary key (product_ID),
    CONSTRAINT FK_product foreign key (admin_id) references Admin(admin_id)
    );
    
CREATE TABLE Admin(
	admin_ID INT auto_increment PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL ,
	password VARCHAR(255) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Admin_log(
	id_log INT auto_increment,
	admin_id INT ,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_date date,
    CONSTRAINT PK_adlog primary key (id_log),
    CONSTRAINT FK_adlog foreign key (admin_id) references Admin(admin_id)
);

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    DOB date,
    gender varchar(10),
    username VARCHAR(50),
    password VARCHAR(255) NOT NULL
);