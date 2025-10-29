USE sec02gr10db;

-- 6688045
Select Feed_ID as 'ID', Feed_Name as 'Name', Feed_LikeNum as 'Like', Feed_Category as 'Category'
FROM Feed
WHERE Feed_Category = 'Beauty' AND Feed_LikeNum < 800;

SELECT CONCAT(PD_Name, ' - ', Serial_Num) AS Product, PD_Stock AS Stock
FROM Product
WHERE PD_Stock between 100 AND 150
ORDER BY Product;

SELECT ADD_Province AS Province, COUNT(*) AS People_Count
FROM Address
GROUP BY ADD_Province 
HAVING ADD_Province LIKE 'Nakhon Ratchasima';

SELECT Accounts.Acc_ID, Accounts.Acc_Nname, Accounts.Acc_Fname, Accounts.Acc_Lname, Accounts.Acc_MobileNum, 
ShoppingBag.NameList, ShoppingBag.PriceList, ShoppingBag.QuantityList
FROM Accounts 
INNER JOIN ShoppingBag
ON Accounts.Acc_ID = ShoppingBag.Acc_ID
WHERE ShoppingBag.QuantityList >= 4;

SELECT Feed.Feed_ID, Feed.Feed_Name, Feed.Feed_PostedDate, Feed.Feed_LikeNum, Feed.Feed_Category, Feed.Feed_Comment,
Likes.Acc_ID
FROM Feed
LEFT OUTER JOIN Likes
ON Feed.Feed_ID = Likes.Feed_ID
HAVING Feed.Feed_LikeNum > 500 AND Feed.Feed_PostedDate > '2024-11-06';


-- 6688084
SELECT Acc_ID AS 'ID', Mem_Point AS 'Point', Mem_Coin AS 'Coin'
FROM Membership
WHERE Mem_Point BETWEEN '1000' AND '2000' AND Mem_Coin < 10;

SELECT Br_ID AS Brand_ID, Promo_ID AS Promotion_ID, Promo_Offer AS Promotion_Offer, Promo_Condition AS Conditions, Promo_SDate AS Start_Date, Promo_EDate AS End_Date, DATEDIFF(Promo_EDate, Promo_SDate) AS Duration
FROM BrandPromotion
WHERE Promo_Offer LIKE '%0%%' AND DATEDIFF(Promo_EDate, Promo_SDate) > 15;

SELECT Promo_ID AS Promotion_ID, Promo_Offer AS Offer, Promo_SDate AS Start_Date, Promo_EDate AS End_Date, DATEDIFF(Promo_EDate, Promo_SDate) AS Duration
FROM BrandPromotion
WHERE DATEDIFF(Promo_EDate, Promo_SDate) BETWEEN 
(SELECT MIN(DATEDIFF(Promo_EDate, Promo_SDate)) 
FROM BrandPromotion
WHERE Promo_SDate BETWEEN '2024-11-08' AND '2024-11-30' AND Promo_EDate BETWEEN '2024-11-08' AND'2024-11-30') AND 
(SELECT MAX(DATEDIFF(Promo_EDate, Promo_SDate)) 
FROM BrandPromotion
WHERE Promo_SDate BETWEEN '2024-11-08' AND '2024-11-30'AND Promo_EDate BETWEEN '2024-11-08' AND '2024-11-30')
ORDER BY Promotion_ID, Offer;

SELECT Accounts.Acc_ID, Accounts.Acc_Nname, Accounts.Acc_Fname, Accounts.Acc_Lname, Accounts.Acc_MobileNum, 
Address.ADD_NO, Address.ADD_Province, Address.ADD_District, Address.ADD_SubDistrict, Address.ADD_PostalCode
FROM Accounts 
INNER JOIN Address
ON Accounts.Acc_ID = Address.Acc_ID
WHERE Address.ADD_PostalCode LIKE "1%";

SELECT ad.ADD_RunningNO, ad.ADD_Fname, ad.ADD_Lname, ad.ADD_PostalCode, sb.BagID, sb.NameList
FROM Address ad
LEFT OUTER JOIN ShoppingBag sb ON ad.Acc_ID = sb.Acc_ID
WHERE ad.ADD_PostalCode LIKE "1%";


-- 6688098
SELECT a.Acc_ID, a.Acc_Fname, a.Acc_Lname, m.Mem_CardName, m.Mem_Coin
FROM Accounts a
LEFT OUTER JOIN Membership m ON a.Acc_ID = m.Acc_ID
WHERE m.Mem_Coin <
(SELECT AVG(m.Mem_Coin) 
FROM Accounts a
LEFT OUTER JOIN Membership m ON a.Acc_ID = m.Acc_ID
WHERE a.Acc_Gender LIKE "F");

SELECT Brand.Br_ID, Brand.Br_Name, 
BrandPromotion.Promo_Offer, BrandPromotion.Promo_Condition, BrandPromotion.Promo_SDate ,BrandPromotion.Promo_EDate
FROM Brand
INNER JOIN BrandPromotion 
ON Brand.Br_ID = BrandPromotion.Br_ID;

SELECT PD_OriginalPrice, COUNT(*) AS Total
FROM Product
GROUP BY PD_OriginalPrice
HAVING PD_OriginalPrice < 
(SELECT AVG(PD_OriginalPrice) AS AVGPrice
FROM Product
WHERE PD_Detail LIKE "%skincare%")
ORDER BY PD_OriginalPrice desc;

SELECT CONCAT(Feed_Category, '_',Feed_ID) AS Feed, Feed_PostedDate AS Posted_Date
FROM Feed
WHERE Feed_PostedDate between '2024-11-03' AND '2024-11-08';

SELECT Br_ID as 'ID' , Br_Name as 'Name' , Br_FollowNum as 'FollowNumber' , Br_Logo as 'Logo'
FROM Brand
WHERE Br_FollowNum < 2500 
AND Br_Logo LIKE '%.png%';


-- 6688104
SELECT a.Acc_ID, a.Acc_Fname, a.Acc_Lname, m.Mem_CardName, m.Mem_Point
FROM Accounts a
LEFT OUTER JOIN Membership m ON a.Acc_ID = m.Acc_ID
WHERE m.Mem_Point >
(SELECT AVG(m.Mem_Point) 
FROM Membership m
WHERE m.Mem_Coin >= 10);

SELECT VDO.VDO_Caption, VDO.VDO_Duration,
Feed.Feed_PostedDate, Feed.Feed_Name, Feed.Feed_LikeNum, Feed.Feed_Category, Feed.Feed_Comment 
FROM VDO
INNER JOIN Feed
ON VDO.Feed_ID = Feed.Feed_ID
WHERE VDO.VDO_Duration >= '00:04:15'
ORDER BY Feed.Feed_PostedDate DESC; 

SELECT Br_ID AS Brand_ID, Serial_Num AS Serial_Number ,PD_Name AS Product_Name, MIN(PD_Stock) AS Stock
FROM Product
GROUP BY Br_ID, Serial_Num
HAVING MIN(PD_Stock) > 0
ORDER BY MIN(PD_Stock) desc;

SELECT
Br_ID AS Brand_ID,
Serial_Num AS Serial_Number,
UCASE(PD_Name) AS Product_Name,
PD_Detail AS Product_Detail,
PD_OriginalPrice AS Product_OriginalPrice
FROM 
Product
WHERE PD_Detail LIKE '%hair%';

SELECT Acc_ID, ADD_District, ADD_MobileNum
FROM Address
WHERE ADD_District = 'Muang' 
AND ADD_MobileNum LIKE '%1234%';


-- 6688153
SELECT b.Br_ID, b.Br_Name, p.Serial_Num, p.PD_Name
FROM Brand b
LEFT OUTER JOIN Product p ON b.Br_ID = p.Br_ID;

SELECT Feed.Feed_Category, MAX(Feed.Feed_PostedDate) AS LatestPostedDate, SUM(Feed.Feed_LikeNum) AS TotalLikes, COUNT(Feed.Feed_Comment) AS TotalComments,
COUNT(Content.Content_Article) AS ArticleCount
FROM Content
INNER JOIN Feed
ON Content.Feed_ID = Feed.Feed_ID
GROUP BY Feed.Feed_Category
HAVING TotalLikes >= 500;

SELECT Br_Name ,MAX(Br_FollowNum) AS Follow
FROM Brand
GROUP BY Br_Name
HAVING MAX(Br_FollowNum) 
ORDER BY MAX(Br_FollowNum) desc limit 3;

SELECT CONCAT(NameList, '_',BagID) AS ProductInBag, PriceList
FROM ShoppingBag
WHERE PriceList between '100' AND '500';

Select Acc_ID as 'ID' , Acc_FName as 'Firstname' , Acc_LName as 'Lastname' , Acc_Gender as 'Gender' , Acc_Email as 'Email' , Acc_BirthDate as 'BirthDate'
FROM Accounts
WHERE Acc_Gender = 'M'
AND Acc_Email LIKE '%@gmail.com%';
