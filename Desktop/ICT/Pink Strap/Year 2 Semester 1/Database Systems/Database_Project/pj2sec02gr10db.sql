DROP DATABASE IF EXISTS sec02gr10db;
CREATE DATABASE IF NOT EXISTS sec02gr10db DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE sec02gr10db;

CREATE TABLE Accounts (
Acc_ID CHAR(8) NOT NULL,
Acc_Nname NVARCHAR(20),
Acc_Fname NVARCHAR(20) NOT NULL,
Acc_Lname NVARCHAR(20) NOT NULL,
Acc_MobileNum CHAR(10) NOT NULL,
Acc_Email NVARCHAR(30) NOT NULL,
Acc_Password VARCHAR(20) NOT NULL,
Acc_Gender CHAR(1) NOT NULL,
Acc_BirthDate DATE NOT NULL,
CONSTRAINT Acc_ID  PRIMARY KEY (Acc_ID)
);
desc Accounts;

CREATE TABLE ShoppingBag (
BagID CHAR(8) NOT NULL,
NameList NVARCHAR(50),
PriceList DECIMAL(12,2),
QuantityList INT NOT NULL,
Acc_ID CHAR(8) NOT NULL,
CONSTRAINT BagID  PRIMARY KEY (BagID),
CONSTRAINT BagAcc_ID FOREIGN KEY (Acc_ID)
REFERENCES Accounts(Acc_ID)
);
desc ShoppingBag;

CREATE TABLE Membership (
Acc_ID CHAR(8) NOT NULL,
Mem_Point DECIMAL(12,2) NOT NULL,
Mem_Coin INT NOT NULL,
Mem_CouponsList NVARCHAR(50) NOT NULL,
Mem_CardName NVARCHAR(30) NOT NULL,
CONSTRAINT MemAcc_ID  PRIMARY KEY (Acc_ID),
CONSTRAINT MemAcc_ID FOREIGN KEY (Acc_ID)
REFERENCES Accounts(Acc_ID)
);
desc Membership;

CREATE TABLE Address (
ADD_RunningNO CHAR(8) NOT NULL,
ADD_Fname NVARCHAR(30) NOT NULL,
ADD_Lname NVARCHAR(30) NOT NULL,
ADD_NO NVARCHAR(10) NOT NULL,
ADD_Province NVARCHAR(30) NOT NULL,
ADD_District NVARCHAR(30) NOT NULL,
ADD_SubDistrict NVARCHAR(30) NOT NULL,
ADD_PostalCode CHAR(5) NOT NULL,
ADD_MobileNum CHAR(10) NOT NULL,
Acc_ID CHAR(8) NOT NULL,
CONSTRAINT RunningNO  PRIMARY KEY (ADD_RunningNO),
CONSTRAINT AddAcc_ID FOREIGN KEY (Acc_ID)
REFERENCES Accounts(Acc_ID)
);
desc Address;

CREATE TABLE Brand (
Br_ID CHAR(8) NOT NULL,
Br_Name NVARCHAR(30) NOT NULL,
Br_FollowNum INT NOT NULL,
Br_Logo NVARCHAR(1000) NOT NULL,
Br_RecommendList NVARCHAR(30) NOT NULL,
CONSTRAINT BrandID PRIMARY KEY (Br_ID)
);
desc Brand;

CREATE TABLE Feed (
Feed_ID CHAR(8) NOT NULL,
Feed_PostedDate DATE NOT NULL,
Feed_Name NVARCHAR(30) NOT NULL,
Feed_LikeNum INT,
Feed_Category NVARCHAR(30) NOT NULL,
Feed_Comment NVARCHAR(50),
CONSTRAINT Feed_ID  PRIMARY KEY (Feed_ID)
);
desc Feed;

CREATE TABLE Content (
Feed_ID CHAR(8) NOT NULL,
Content_ID CHAR(8) NOT NULL,
Content_Article NVARCHAR(100) NOT NULL,
CONSTRAINT Content_ID PRIMARY KEY (Content_ID),
CONSTRAINT ConFeed_ID FOREIGN KEY (Feed_ID)
REFERENCES Feed(Feed_ID)
);
desc Content;

CREATE TABLE VDO (
Feed_ID CHAR(8) NOT NULL,
VDO_ID CHAR(8) NOT NULL,
VDO_Caption NVARCHAR(100),
VDO_Duration TIME NOT NULL,
CONSTRAINT VDOID PRIMARY KEY (VDO_ID),
CONSTRAINT VDOFeed_ID FOREIGN KEY (Feed_ID)
REFERENCES Feed(Feed_ID)
);
desc VDO;

CREATE TABLE Likes (
Feed_ID CHAR(8) NOT NULL,
Acc_ID CHAR(8) NOT NULL,
CONSTRAINT FeedID FOREIGN KEY (Feed_ID)
REFERENCES Feed(Feed_ID),
CONSTRAINT LikesAccID FOREIGN KEY (Acc_ID)
REFERENCES Accounts(Acc_ID)
);
desc Likes;

CREATE TABLE Follow (
Br_ID CHAR(8) NOT NULL,
Acc_ID CHAR(8) NOT NULL,

CONSTRAINT BrandID FOREIGN KEY (Br_ID)
REFERENCES Brand(Br_ID),
CONSTRAINT FollAcc_ID FOREIGN KEY (Acc_ID)
REFERENCES Accounts(Acc_ID)
);
desc Follow;

CREATE TABLE BrandPromotion (
Promo_ID CHAR(8) NOT NULL,
Promo_Offer NVARCHAR(100),
Promo_Condition NVARCHAR(50) NOT NULL,
Promo_SDate DATE NOT NULL,
Promo_EDate DATE NOT NULL,
Br_ID CHAR(8) NOT NULL,
CONSTRAINT Promo_ID PRIMARY KEY (Promo_ID ),
CONSTRAINT PromoBrandID FOREIGN KEY (Br_ID)
REFERENCES Brand(Br_ID)
);
desc BrandPromotion;

CREATE TABLE Product (
Serial_Num CHAR(13) NOT NULL,
PD_Name NVARCHAR(30) NOT NULL,
PD_Detail NVARCHAR(300) NOT NULL,
PD_OriginalPrice DECIMAL(12,2) NOT NULL,
PD_HowToUse NVARCHAR(500) NOT NULL,
PD_Review NVARCHAR(500),
PD_QnA NVARCHAR(500),
PD_Stock INT NOT NULL,
Br_ID CHAR(8) NOT NULL,
CONSTRAINT SerialNum  PRIMARY KEY (Serial_Num),
CONSTRAINT PDBrandID FOREIGN KEY (Br_ID)
REFERENCES Brand(Br_ID)
);
desc Product;

-- Inserting data into Accounts table
-- Inserting data into Accounts table
INSERT INTO Accounts (Acc_ID, Acc_Nname, Acc_Fname, Acc_Lname, Acc_MobileNum, Acc_Email, Acc_Password, Acc_Gender, Acc_BirthDate)
VALUES
('00000001', 'Chai', 'Somchai', 'Somsri', '0912402040', 'somchai@gmail.com', 'chai123', 'M', '2004-11-02'),
('00000002', 'Nong', 'Somsak', 'Somsri', '0823456789', 'nongsak@gmail.com', 'nongsak123', 'M', '2002-05-14'),
('00000003', 'Ann', 'Ananya', 'Siri', '0834567890', 'ananya.siri@hotmail.com', 'ananya123', 'F', '2001-08-21'),
('00000004', 'Mai', 'Noknoy', 'Thongchai', '0845678901', 'Noknoy@hotmail.com', 'mai123', 'F', '2003-12-09'),
('00000005', 'Pong', 'Pongpat', 'Ratchada', '0856789012', 'pongpat.ratchada@gmail.com', 'pongpat123', 'M', '2000-03-17'),
('00000006', 'Fon', 'Phawinee', 'Charoensuk', '0867890123', 'fon.charoensuk@hotmail.com', 'fon123', 'F', '2001-07-22'),
('00000007', 'Tee', 'Teerawat', 'Boonlert', '0878901234', 'tee.boonlert@outlook.com', 'tee123', 'M', '1999-09-30'),
('00000008', 'Nok', 'Noknoy', 'Kanokwan', '0889012345', 'nokkanok@gmail.com', 'nok123', 'F', '2003-11-05'),
('00000009', 'Ood', 'Orawan', 'Wonglert', '0890123456', 'ood.wonglert@hotmail.com', 'ood123', 'F', '2002-04-11'),
('00000010', 'Ood', 'Jitpanyade', 'Panyajitde', '0890124456', 'jit.maidee@gmail.com', 'jit123', 'F', '2006-02-11'),
('00000011', 'Beam', 'Buranat', 'Wongsa', '0801234567', 'beam@gmail.com', 'beam123', 'M', '2000-12-25'),
('00000012', 'Bank', 'Kitti', 'Chai', '0801268597', 'bankza@gmail.com', 'bank24242', 'M', '2000-12-25');

-- Inserting data into ShoppingBag table
INSERT INTO ShoppingBag (BagID, NameList, PriceList, QuantityList, Acc_ID)
VALUES
('00000001', 'Cosmetic Set A', 1200.50, 2, '00000001'),
('00000002', 'Skincare Kit B', 950.00, 1, '00000002'),
('00000003', 'Fragrance Pack C', 1800.75, 3, '00000003'),
('00000004', 'Makeup Bundle D', 750.20, 4, '00000004'),
('00000005', 'Haircare Set E', 640.00, 2, '00000005'),
('00000006', 'Wellness Combo F', 500.00, 5, '00000006'),
('00000007', 'Beauty Kit G', 1125.30, 1, '00000007'),
('00000008', 'Travel Pack H', 300.45, 6, '00000008'),
('00000009', 'Luxury Skincare I', 1500.90, 2, '00000009'),
('00000010', 'Fragrance Set J', 850.80, 3, '00000010'),
('00000011', 'SOAP Set K', 850.80, 3, '00000011'),
('00000012', 'SOAP Set L', 850.80, 3, '00000011'),
('00000013', 'Fragrance Set O', 850.80, 3, '00000010'),
('00000014', 'Beauty Kit G', 1125.30, 1, '00000007');

-- Inserting data into Membership table
INSERT INTO Membership (Acc_ID, Mem_Point, Mem_Coin, Mem_CouponsList, Mem_CardName)
VALUES
('00000001', 2500.50, 10, 'CouponA,CouponB', 'CardA'),
('00000002', 1800.00, 5, 'CouponC,CouponD', 'CardB'),
('00000003', 1200.30, 7, 'CouponE,CouponF', 'CardC'),
('00000004', 3000.75, 12, 'CouponG,CouponH', 'CardD'),
('00000005', 1500.20, 6, 'CouponI,CouponJ', 'CardE'),
('00000006', 2200.60, 8, 'CouponK,CouponL', 'CardF'),
('00000007', 2800.90, 11, 'CouponM,CouponN', 'CardG'),
('00000008', 1900.00, 9, 'CouponO,CouponP', 'CardH'),
('00000009', 3500.45, 15, 'CouponQ,CouponR', 'CardI'),
('00000010', 2700.80, 10, 'CouponS,CouponT', 'CardJ'),
('00000011', 2350.80, 10, 'CouponK,CouponK', 'CardK');


-- Inserting data into Address table
INSERT INTO Address (ADD_RunningNO, ADD_Fname, ADD_Lname, ADD_NO, ADD_Province, ADD_District, ADD_SubDistrict, ADD_PostalCode, ADD_MobileNum, Acc_ID)
VALUES
('10000001', 'Somchai', 'Somsri', '1234', 'Bangkok', 'Sukhumvit', 'Phra Khanong', '10110', '0912402040', '00000001'),
('10000002', 'Somsak', 'Somsri', '5678', 'Phuket Mai', 'Muang', 'Sut', '50200', '0823456789', '00000002'),
('10000003', 'Ananya', 'Siri', '9101', 'Phuket', 'Muang', 'Talad Yai', '83000', '0834567890', '00000003'),
('10000004', 'Suphansa', 'Thongchai', '1122', 'Chonburi', 'Sriracha', 'Sanaeng', '20110', '0845678901', '00000004'),
('10000005', 'Pongpat', 'Ratchada', '3344', 'Ayutthaya', 'Sena', 'Talingchan', '13000', '0856789012', '00000005'),
('10000006', 'Phawinee', 'Charoensuk', '5566', 'Khon Kaen', 'Muang', 'Nai Mueang', '40000', '0867890123', '00000006'),
('10000007', 'Teerawat', 'Boonlert', '7788', 'Udon Thani', 'Muang', 'Na Kha', '41000', '0878901234', '00000007'),
('10000008', 'Noknoy', 'Kanokwan', '9900', 'Nakhon Ratchasima', 'Muang', 'Suranaree', '30000', '0889012345', '00000008'),
('10000009', 'Orawan', 'Wonglert', '2233', 'Nakhon Ratchasima', 'Muang', 'Suranaree', '20150', '0890123456', '00000009'),
('10000010', 'Buranat', 'Wongsa', '4455', 'Saraburi', 'Muang', 'Nong Kae', '18000', '0801234567', '00000010');

-- Inserting data into Brand table
INSERT INTO Brand (Br_ID, Br_Name, Br_FollowNum, Br_Logo, Br_RecommendList)
VALUES
('B0000001', 'BrandA', 2500, 'logoA.png', 'ProductA, ProductB'),
('B0000002', 'BrandB', 1900, 'logoB.png', 'ProductC, ProductD'),
('B0000003', 'BrandC', 3000, 'logoC.png', 'ProductE, ProductF'),
('B0000004', 'BrandD', 1500, 'logoD.png', 'ProductG, ProductH'),
('B0000005', 'BrandE', 2200, 'logoE.png', 'ProductI, ProductJ'),
('B0000006', 'BrandF', 2800, 'logoF.png', 'ProductK, ProductL'),
('B0000007', 'BrandG', 3500, 'logoG.png', 'ProductM, ProductN'),
('B0000008', 'BrandH', 2700, 'logoH.png', 'ProductO, ProductP'),
('B0000009', 'BrandI', 1800, 'logoI.png', 'ProductQ, ProductR'),
('B0000010', 'BrandJ', 2400, 'logoJ.png', 'ProductS, ProductT');

-- Inserting data into Feed table
INSERT INTO Feed (Feed_ID, Feed_PostedDate, Feed_Name, Feed_LikeNum, Feed_Category, Feed_Comment)
VALUES
('F0000001', '2024-11-01', 'ProductA Launch', 500, 'Fashion', 'Excited about this launch!'),
('F0000002', '2024-11-02', 'Summer Collection', 300, 'Beauty', 'Perfect for the summer look!'),
('F0000003', '2024-11-03', 'Discounts on Skincare', 800, 'Skincare', 'Get the best deals on skincare'),
('F0000004', '2024-11-04', 'New Fragrance Collection', 450, 'Fragrance', 'Smell great with our new scents'),
('F0000005', '2024-11-05', 'Makeup Essentials', 350, 'Makeup', 'Get your makeup essentials here'),
('F0000006', '2024-11-06', 'Haircare Sale', 620, 'Haircare', 'Haircare sale! Don’t miss out!'),
('F0000007', '2024-11-07', 'Beauty Bundle Offer', 550, 'Beauty', 'Amazing beauty bundle offer!'),
('F0000008', '2024-11-08', 'Exclusive Discounts', 400, 'Fashion', 'Get exclusive discounts now!'),
('F0000009', '2024-11-09', 'New Launch - Makeup Kit', 1000, 'Makeup', 'Try our new makeup kits today!'),
('F0000010', '2024-11-10', 'Gift Ideas for Her', 900, 'Gift Ideas', 'Perfect gifts for your loved ones');


-- Inserting data into Content table
INSERT INTO Content (Feed_ID, Content_ID, Content_Article)
VALUES
('F0000001', 'C0000001', 'This is an article about the new product launch.'),
('F0000002', 'C0000002', 'Our summer collection is designed to keep you cool.'),
('F0000003', 'C0000003', 'Read about the latest skincare tips to keep glowing.'),
('F0000004', 'C0000004', 'The new fragrance collection is here! Find your scent.'),
('F0000005', 'C0000005', 'Get the best makeup products for a perfect everyday look.'),
('F0000006', 'C0000006', 'Our haircare set helps you maintain smooth, silky hair.'),
('F0000007', 'C0000007', 'Introducing a beauty bundle for a complete look.'),
('F0000008', 'C0000008', 'Exclusive discounts just for you! Shop and save big.'),
('F0000009', 'C0000009', 'Our new makeup kits are perfect for every occasion!'),
('F0000010', 'C0000010', 'Looking for the perfect gift? We have many ideas.');


-- Inserting data into VDO table
INSERT INTO VDO (Feed_ID, VDO_ID, VDO_Caption, VDO_Duration)
VALUES
('F0000001', 'V0000001', 'Brand A product launch video', '00:05:30'),
('F0000002', 'V0000002', 'Summer collection showcase video', '00:06:45'),
('F0000003', 'V0000003', 'Skincare routine tips video', '00:04:00'),
('F0000004', 'V0000004', 'Fragrance collection teaser video', '00:03:25'),
('F0000005', 'V0000005', 'Makeup tutorial for beginners video', '00:07:10'),
('F0000006', 'V0000006', 'How to use our new haircare products video', '00:06:20'),
('F0000007', 'V0000007', 'Unboxing our new beauty bundle video', '00:08:00'),
('F0000008', 'V0000008', 'Exclusive discount announcement video', '00:02:30'),
('F0000009', 'V0000009', 'Makeup kit review video', '00:05:50'),
('F0000010', 'V0000010', 'Gift ideas for her video', '00:04:15');

-- Inserting data into Likes table
INSERT INTO Likes (Feed_ID, Acc_ID)
VALUES
('F0000001', '00000001'),
('F0000001', '00000002'),
('F0000001', '00000003'),
('F0000002', '00000004'),
('F0000002', '00000005'),
('F0000002', '00000006'),
('F0000003', '00000007'),
('F0000003', '00000008'),
('F0000003', '00000009'),
('F0000004', '00000010'),
('F0000004', '00000011'),
('F0000004', '00000012'),
('F0000005', '00000001'),
('F0000005', '00000002'),
('F0000005', '00000003'),
('F0000006', '00000004'),
('F0000006', '00000005'),
('F0000006', '00000006'),
('F0000007', '00000007'),
('F0000007', '00000008'),
('F0000007', '00000009'),
('F0000008', '00000010'),
('F0000008', '00000011'),
('F0000008', '00000012'),
('F0000009', '00000001'),
('F0000009', '00000002'),
('F0000009', '00000003'),
('F0000010', '00000004'),
('F0000010', '00000005'),
('F0000010', '00000006');


-- Inserting data into Follow table
INSERT INTO Follow (Br_ID, Acc_ID)
VALUES
('B0000001', '00000001'),
('B0000002', '00000002'),
('B0000003', '00000003'),
('B0000004', '00000004'),
('B0000005', '00000005'),
('B0000006', '00000006'),
('B0000007', '00000007'),
('B0000008', '00000007'),
('B0000009', '00000009'),
('B0000010', '00000010'),
('B0000009', '00000011'),
('B0000010', '00000012'),
('B0000001', '00000002'),
('B0000002', '00000003'),
('B0000003', '00000004'),
('B0000004', '00000005'),
('B0000005', '00000006'),
('B0000006', '00000007'),
('B0000007', '00000008'),
('B0000008', '00000009'),
('B0000009', '00000010'),
('B0000010', '00000011'),
('B0000001', '00000012'),
('B0000002', '00000001'),
('B0000001', '00000003'),
('B0000002', '00000005'),
('B0000003', '00000007'),
('B0000004', '00000009'),
('B0000005', '00000011');

-- Inserting data into BrandPromotion table
INSERT INTO BrandPromotion (Promo_ID, Promo_Offer, Promo_Condition, Promo_SDate, Promo_EDate, Br_ID)
VALUES
('P0000001', 'Get 20% off on all products', 'Purchase over 1000 THB', '2024-11-01', '2024-11-30', 'B0000001'),
('P0000002', 'Buy 1, get 1 free on skincare', 'For all skincare products', '2024-11-02', '2024-11-25', 'B0000002'),
('P0000003', '10% off on your first order', 'New customers only', '2024-11-03', '2024-11-20', 'B0000003'),
('P0000004', 'Free shipping on orders above 500 THB', 'No minimum purchase required', '2024-11-04', '2024-11-15', 'B0000004'),
('P0000005', 'Get a free gift with every purchase', 'While stocks last', '2024-11-05', '2024-11-10', 'B0000005'),
('P0000006', '20% off for members', 'Valid for members only', '2024-11-06', '2024-11-20', 'B0000006'),
('P0000007', 'Exclusive bundle offer', 'Purchase all items in the bundle', '2024-11-07', '2024-11-25', 'B0000007'),
('P0000008', '30% off on all cosmetics', 'On selected cosmetics', '2024-11-08', '2024-11-30', 'B0000008'),
('P0000009', 'Flash sale: 50% off', 'For the first 100 customers', '2024-11-09', '2024-11-10', 'B0000009'),
('P0000010', '15% off on all makeup products', 'No minimum purchase required', '2024-11-10', '2024-11-30', 'B0000010');

-- Inserting data into Product table
INSERT INTO Product (Serial_Num, PD_Name, PD_Detail, PD_OriginalPrice, PD_HowToUse, PD_Review, PD_QnA, PD_Stock, Br_ID)
VALUES
('S000000000001', 'ProductA', 'A high-quality skincare product', 500.00, 'Apply after cleansing', 'Great product for glowing skin', 'Does this product suit sensitive skin?', 100, 'B0000001'),
('S000000000002', 'ProductB', 'Luxury fragrance for daily use', 1000.00, 'Spray on pulse points', 'Long-lasting fragrance', 'How long does the scent last?', 50, 'B0000002'),
('S000000000003', 'ProductC', 'Makeup kit for a natural look', 800.00, 'Apply on face and blend well', 'Perfect for daily use', 'Can I use this for sensitive skin?', 200, 'B0000003'),
('S000000000004', 'ProductD', 'Haircare set for smooth hair', 1200.00, 'Use daily after shower', 'Makes my hair smooth and shiny', 'Is this product sulfate-free?', 150, 'B0000004'),
('S000000000005', 'ProductE', 'Nutrient-rich hair mask', 750.00, 'Apply on hair for 15 minutes', 'Perfect for dry hair', 'How often should I use this mask?', 80, 'B0000005'),
('S000000000006', 'ProductF', 'Rejuvenating skincare set', 950.00, 'Use morning and night', 'Keeps my skin hydrated all day', 'Is this set good for aging skin?', 120, 'B0000006'),
('S000000000007', 'ProductG', 'Moisturizer for all skin types', 650.00, 'Apply generously after cleansing', 'Lightweight and absorbs quickly', 'Is this product non-comedogenic?', 300, 'B0000007'),
('S000000000008', 'ProductH', 'Gentle exfoliator for smooth skin', 400.00, 'Massage on damp skin, then rinse', 'Removes dead skin cells effectively', 'Can this exfoliator be used daily?', 180, 'B0000008'),
('S000000000009', 'ProductI', 'Brightening face serum', 900.00, 'Apply a few drops on face', 'Gives a bright and even complexion', 'Is this serum suitable for dark skin?', 75, 'B0000009'),
('S000000000010', 'ProductJ', 'Sunscreen for daily protection', 650.00, 'Apply before sun exposure', 'Protects skin from UV rays', 'How long does the protection last?', 250, 'B0000010');
