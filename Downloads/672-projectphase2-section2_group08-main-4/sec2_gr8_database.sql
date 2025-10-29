-- DROP DATABASE IF EXISTS kspace;
CREATE DATABASE kspace;

USE kspace;

CREATE TABLE Admins (
    admin_ID VARCHAR(100) PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Consider hashing passwords in production
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Product (
    product_ID INT,
    product_Category VARCHAR(160),
    Name VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    artist VARCHAR(100),
    release_date DATE,
    quantity INT,
    Product_Image VARCHAR(255),
    admin_ID VARCHAR(100),
    CONSTRAINT PK_product PRIMARY KEY (product_ID)
);

CREATE TABLE Admin_log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    admin_ID VARCHAR(100), -- Changed to VARCHAR(100) to match Admins
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_date DATE,
    CONSTRAINT FK_adlog FOREIGN KEY (admin_ID) REFERENCES Admins(admin_ID)
);

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    DOB DATE,
    gender VARCHAR(10), -- Consider ENUM('Male', 'Female', 'Other')
    username VARCHAR(50),
    password VARCHAR(255) NOT NULL
);


INSERT INTO Admins (admin_ID, f_name, l_name, username, password)
VALUES 
('AD1', 'Sarah', 'Connor', 'sconnor', 'sarah123'),
('AD2', 'John', 'Reed', 'jreed', 'johnpass'),
('AD3', 'Linda', 'Hamilton', 'lhamilton', 'linda456'),
('AD4', 'Robert', 'Miles', 'rmiles', 'robsecure'),
('AD5', 'Angela', 'White', 'awhite', 'angelaPW'),
('AD6', 'Mark', 'Stone', 'mstone', 'markS321'),
('AD7', 'Julia', 'Roberts', 'jroberts', 'julia789'),
('AD8', 'Kevin', 'Brooks', 'kbrooks', 'kevinPW'),
('AD9', 'Rachel', 'Green', 'rgreen', 'rachelG123'),
('AD10', 'Tom', 'Harris', 'tharris', 'tomHpass');
-- Removed duplicate admin_ID 'AD11'

INSERT INTO Customer (f_name, l_name, email, phone, DOB, gender, username, password)
VALUES 
('Emily', 'Clark', 'emily.clark@example.com', '123-456-7890', '1990-03-15', 'Female', 'eclark', 'emilypass'),
('Michael', 'Lee', 'michael.lee@example.com', '987-654-3210', '1985-07-22', 'Male', 'mlee', 'mikelee123'),
('Sophia', 'Davis', 'sophia.davis@example.com', '456-789-1234', '1992-11-02', 'Female', 'sdavis', 'sophiad456'),
('James', 'Brown', 'james.brown@example.com', '321-654-0987', '1988-01-30', 'Male', 'jbrown', 'jbpass89'),
('Olivia', 'Wilson', 'olivia.wilson@example.com', '789-123-4567', '1995-09-10', 'Female', 'owilson', 'oliv!a95'),
('Liam', 'Taylor', 'liam.taylor@example.com', '555-111-2222', '1991-06-18', 'Male', 'ltaylor', 'liamTpass'),
('Ava', 'Moore', 'ava.moore@example.com', '444-333-2222', '1998-04-25', 'Female', 'amoore', 'ava!pass'),
('Noah', 'Anderson', 'noah.anderson@example.com', '666-777-8888', '1987-12-12', 'Male', 'nanderson', 'noah@123'),
('Mia', 'Thomas', 'mia.thomas@example.com', '777-888-9999', '1993-08-07', 'Female', 'mthomas', 'miaTsecure'),
('Ethan', 'Martin', 'ethan.martin@example.com', '111-222-3333', '1989-05-03', 'Male', 'test2', 'test2');

-- Insert into Admin_log
INSERT INTO Admin_log (admin_ID, login_date)
VALUES 
('AD1', CURDATE()),
('AD2', CURDATE()),
('AD3', CURDATE()),
('AD4', CURDATE()),
('AD5', CURDATE()),
('AD6', CURDATE()),
('AD7', CURDATE()),
('AD8', CURDATE()),
('AD9', CURDATE()),
('AD10', CURDATE());

INSERT INTO Product (product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image)
VALUES
(001, 'Album', 'The 1st Album - Armageddon (Poster Ver.)', 'SM Entertainment', 1.00, 'aespa', '2024-05-27', 1, '/Armageddon.png'),
(002, 'Album', 'The 2nd Mini Album - Girls (Real World Ver.)', 'SM Entertainment', 1000.00, 'aespa', '2022-07-08', 1, '/02.jpg'),
(003, 'Album', 'The 1st Mini Album - Savage (HALLUCINATION QUEST Ver.)', 'SM Entertainment', 1000.00, 'aespa', '2021-10-05', 1, '/Savage.png'),
(004, 'Album', 'The 3rd Mini Album - MY WORLD (Intro Ver.)', 'SM Entertainment', 1000.00, 'aespa', '2023-05-08', 1, '/03.jpg'),
(005, 'Album', 'The 1st Album - Armageddon (Regular Ver.)', 'SM Entertainment', 1000.00, 'aespa', '2024-05-27', 1, '/09.jpg'),
(006, 'Album', 'The 1st Full Album - DRIP (BANDANA Ver. Limited Edition)', 'YG Entertainment', 1000.00, 'BABYMONSTER', '2024-11-01', 1, 'S__15859754.jpg'),
(007, 'Album', 'The 4th Mini Album - MAD (Winter Edition)', 'JYP Entertainment', 1000.00, 'GOT7', '2015-11-23', 1, 'S__15859749.jpg'),
(008, 'Album', 'The 3rd Mini Album - Flight Log: Arrival', 'JYP Entertainment', 1000.00, 'GOT7', '2017-03-13', 1, 'S__15859747.jpg'),
(009, 'Album', 'The 2nd Mini Album - Get Up (Super Shy)', 'Hype', 1000.00, 'NewJeans', '2023-07-07', 1, 'S__15859746.jpg'),
(010, 'Album', 'The 1st Mini Album - New Jeans (Hype Boy)', 'Hype', 1000.00, 'NewJeans', '2022-07-22', 1, 'S__15859744.jpg');
    
select * from Admin_log;

SELECT product_ID, Product_Image FROM Product;


