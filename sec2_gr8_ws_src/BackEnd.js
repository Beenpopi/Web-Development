
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


dotenv.config();
const PORT = process.env.PORT || 8003;
const app = express();


app.use(session({
    store: new FileStore({ path: './sessions', retries: 0 }),
    secret: process.env.SESSION_SECRET || 'your-secure-secret-key', 
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// Middleware
app.use(cookieParser()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// CORS Setup
const whiteList = ['http://localhost:8080']; 
const corsOptions = {
    origin: whiteList,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
};
app.use(cors(corsOptions));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const uploadDir = path.join(__dirname, 'public', 'Image');
        fs.mkdirSync(uploadDir, { recursive: true }); 
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});


const Datacon = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

Datacon.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.stack);
    
        throw err; 
    }
    console.log(`✅ Connected to DB: ${process.env.MYSQL_DATABASE}`);
});


const router = express.Router();


const isAdmin = (req, res, next) => {

    if (req.session.user && req.session.user.userType === 'admin') {
      
        return next();
    } else if (req.session.user) {
        
        console.log(`Access Denied: User ${req.session.user.username} (not admin) tried to access admin route.`);
        window.location.href = '/HomePage'; 

        res.status(403).send(`
            <script>
                alert('Access Denied: You do not have admin privileges.');
                window.location.href = '/HomePage'; // Redirect non-admins to HomePage
            </script>
        `);
    } else {
        
        console.log('Access Denied: Non-logged-in user tried to access admin route.');
        res.status(401).send(`
            <script>
                alert('Access Denied: Please log in as an admin.');
                window.location.href = '/login'; // Redirect non-logged-in users to login
            </script>
        `);
    }
};

router.get('/login', (req, res) => {
    console.log("Request at " + req.url);
    if (req.session.user) {
        const redirectUrl = req.session.user.userType === 'admin' ? '/HomePage' : '/HomePage';
        console.log(`User ${req.session.user.username} already logged in, redirecting to ${redirectUrl}`);
        return res.redirect(redirectUrl);
    }
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});



router.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({
            isLoggedIn: true,
            isAdmin: req.session.user.userType === 'admin',
            username: req.session.user.username,
            userType: req.session.user.userType  
        });
    }
    // Not logged in
    res.status(200).json({ isLoggedIn: false });
});

// Testing login
// method: post
// URL: http://localhost:8003/login
// body: raw JSON
//{
//    "username": "test2",
//    "password": "test2",
//    "userType": "customer"
//
//}
//{
//    "message": "Login successful.",
//    "redirect": "/HomePage"
//}


// Testing login
// method: post
// URL: http://localhost:8003/login
// body: raw JSON
//{
//    "username": "test2",
//    "password": "test3",
//    "userType": "customer"
//
//}
//{
//    "error": "Invalid username or password."
//}
//Login
router.post('/login', async (req, res) => {
    console.log("Login attempt at " + req.url);
    console.log("Login body received:", req.body);

    const { username, password, userType,} = req.body;

    
    if (!username || !password || !userType) { // Removed recaptcha check for simplicity, add back if needed
        console.log("Missing fields:", { username, password, userType /*, recaptchaResponse */});
        return res.status(400).json({ error: "Missing required fields: username, password, userType." });
    }
    try {
        const table = userType === 'admin' ? 'Admins' : 'customer'; 
        const query = `SELECT * FROM ${mysql.escapeId(table)} WHERE username = ?`; 

        Datacon.query(query, [username], (err, result) => {
            if (err) {
                console.error('Database error during login query:', err);
                return res.status(500).json({ error: "Internal server error during login." });
            }
            if (result.length === 0) {
                 console.log(`Login failed: User '${username}' not found in table '${table}'.`);
                return res.status(401).json({ error: "Invalid username or password." }); 
            }

            
            if (password !== result[0].password) {
                console.log(`Login failed: Incorrect password for user '${username}'.`);
                return res.status(401).json({ error: "Invalid username or password." }); 
            }
            
            console.log(`Login successful for user '${username}' as type '${userType}'.`);

            
            req.session.regenerate(err => {
                if (err) {
                     console.error("Session regeneration failed:", err);
                     return res.status(500).json({ error: "Session error during login." });
                }

                
                req.session.user = { username: result[0].username, userType: userType }; 

               
                if (userType === 'admin') {
                    const adminId = result[0].admin_ID; 
                    if (adminId) {
                        const logQuery = `INSERT INTO Admin_log (admin_ID, login_date) VALUES (?, CURDATE())`;
                        Datacon.query(logQuery, [adminId], (logErr) => {
                            if (logErr) console.error('Failed to log admin login:', logErr);
                            else console.log(`Admin login logged for admin_ID: ${adminId}`);
                        });
                    } else {
                         console.warn(`Admin user ${username} logged in, but admin_ID not found in result.`);
                    }
                }

               
                const redirectUrl = userType === 'admin' ? '/HomePage' : '/HomePage';
                return res.status(200).json({
                    message: "Login successful.",
                    redirect: redirectUrl
                });
            }); 
        });
    } catch (error) {
        console.error('Login processing error:', error);
        return res.status(500).json({ error: "Internal server error processing login." });
    }
});


// Testing get all products
// method: get
// URL: http://localhost:8003/api/products
// body: raw JSON
/*{
    "product_ID": 1,
    "product_Category": "Album",
    "Name": "The 1st Album [Armageddon] (Poster Ver.)",
    "label": "SM Entertainment",
    "price": "30.00",
    "artist": "aespa",
    "release_date": "2025-02-23T17:00:00.000Z",
    "quantity": 1,
    "Product_Image": "/Armageddon.png"
},
{
    "product_ID": 2,
    "product_Category": "Album",
    "Name": "GGirls 2nd Mini Album (Real World Ver.)",
    "label": "SM Entertainment",
    "price": "1000.00",
    "artist": "aespa",
    "release_date": null,
    "quantity": 1,
    "Product_Image": "/02.jpg"
},
{
    "product_ID": 4,
    "product_Category": "Album",
    "Name": "MY WORLD 3rd Mini Album (Intro Ver.)",
    "label": "SM Entertainment",
    "price": "1000.00",
    "artist": "aespa",
    "release_date": null,
    "quantity": 1,
    "Product_Image": "/03.jpg"
},
{
    "product_ID": 5,
    "product_Category": "Album",
    "Name": "Armageddon Album (Regular Ver.)",
    "label": "SM Entertainment",
    "price": "1000.00",
    "artist": "aespa",
    "release_date": null,
    "quantity": 1,
    "Product_Image": "/09.jpg"
},*/



router.get('/api/products', (req, res) => {
    const query = 'SELECT product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image FROM Product';
    Datacon.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Internal server error fetching products.' });
        }
        res.status(200).json(results);
    });
});




router.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }
    const query = 'SELECT product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image FROM Product WHERE product_ID = ?';
    Datacon.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product by ID:', err);
            return res.status(500).json({ error: 'Internal server error fetching product.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(results[0]);
    });
});


router.get('/api/related-products', (req, res) => {
    const { artist, exclude_id } = req.query;
    if (!artist || !exclude_id) {
         return res.status(400).json({ error: 'Artist and exclude_id query parameters are required.' });
    }
    const query = 'SELECT product_ID, Name, Product_Image FROM Product WHERE artist = ? AND product_ID != ? LIMIT 4';
    Datacon.query(query, [artist, exclude_id], (err, results) => {
        if (err) {
            console.error('Error fetching related products:', err);
            return res.status(500).json({ error: 'Internal server error fetching related products.' });
        }
        res.status(200).json(results);
    });
});

// Testing Search the product
// method: get
// URL: http://localhost:8003/api/search
// body: raw JSON
// {
//     "name": "MY WORLD 3rd Mini Album (Intro Ver.)",
//     "artist": "aespa",
//     "label": "SM Entertainment"
// }


// Testing Search the product
// method: get
// URL: http://localhost:8003/api/search
// body: raw JSON
//{
//    "name": "Hiswssqsq",
//    "artist": "POPIswsws",
//    "label": "ICTswswsws"
//}

router.get('/api/search', (req, res) => {
    const { name, artist, label } = req.query;

    let sql = 'SELECT product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image FROM Product WHERE 1=1'; // Start with true condition
    const params = [];

    if (name) {
        sql += ' AND Name LIKE ?';
        params.push(`%${name}%`);
    }
    if (artist) {
        sql += ' AND artist LIKE ?';
        params.push(`%${artist}%`);
    }
    if (label) {
        sql += ' AND label LIKE ?';
        params.push(`%${label}%`);
    }

    if (params.length === 0) {
        return res.status(400).json({ error: "Please provide at least one search filter (name, artist, or label)." });
    }


    Datacon.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching search results:', err);
            return res.status(500).json({ error: 'Internal server error during search.' });
        }
        res.status(200).json({ results }); 
    });
});




// Testing request the products for admin
// method: get
// URL: http://localhost:8003/api/admin/products
// body: raw JSON
// {
//     "product_ID": 2,
//     "product_Category": "Album",
//     "Name": "GGirls 2nd Mini Album (Real World Ver.)",
//     "label": "SM Entertainment",
//     "price": "1000.00",
//     "artist": "aespa",
//     "release_date": null,
//     "quantity": 1,
//     "Product_Image": "/02.jpg"
// },
// {
//     "product_ID": 4,
//     "product_Category": "Album",
//     "Name": "MY WORLD 3rd Mini Album (Intro Ver.)",
//     "label": "SM Entertainment",
//     "price": "1000.00",
//     "artist": "aespa",
//     "release_date": null,
//     "quantity": 1,
//     "Product_Image": "/03.jpg"
// },
router.get('/api/admin/products', isAdmin, (req, res) => {
    console.log("Admin request for all products by:", req.session.user.username);
    const query = 'SELECT product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image FROM Product';
    Datacon.query(query, (err, results) => {
        if (err) {
            console.error('Admin: Error fetching products:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        res.status(200).json(results);
    });
});


//Test admin add product success
//method: post
//URL: http://localhost:8003/api/admin/products
//body: raw JSON

//{
//    "product_ID": "4",
//    "product_Category": "Vinyl",
//    "Name": "Abbey Road",
//    "label": "Apple Records",
//    "price": 29.99,
//    "artist": "The Beatles",
//    "release_date": "1969-09-26",
//    "quantity": 100,
//    "Product_Image": "/Image/abbey_road.jpg"
//  }
//{
//    "message": "Product added successfully!",
//    "insertedId": 0
//}


//Test admin add product product already exists
//method: post
//URL: http://localhost:8003/api/admin/products
//body: raw JSON

//{
//    "error": "Product with ID 1 already exists."
//}

//Add Product
router.post('/api/admin/products', isAdmin, upload.single('Product_Image'), (req, res) => {
    console.log("Admin POST product attempt by:", req.session.user.username);
    console.log("POST /api/admin/products body:", req.body);
    console.log("POST /api/admin/products file:", req.file);

    
    const { product_ID, product_Category, Name, label, price, artist, release_date, quantity } = req.body;
    const Product_Image = req.file ? `/Image/${req.file.filename}` : (req.body.Product_Image || null); 
    const sanitizedReleaseDate = release_date && release_date !== 'null' && release_date !== '' ? release_date : null; 
    const admin_ID = req.session.user.admin_ID || 'AD1'; 

    
    if (!product_ID || !Name || !label || !price || !artist || !quantity) {
        // Clean up uploaded file if validation fails
         if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting uploaded file after validation fail:", err);
            });
        }
        return res.status(400).json({ error: 'Missing required fields: product_ID, Name, label, price, artist, quantity' });
    }

    const sql = `INSERT INTO Product (product_ID, product_Category, Name, label, price, artist, release_date, quantity, Product_Image, admin_ID)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [product_ID, product_Category || null, Name, label, price, artist, sanitizedReleaseDate, quantity, Product_Image, admin_ID];

    Datacon.query(sql, params, (err, result) => {
        if (err) {
            console.error('Admin: Error adding product:', err);
             // Clean up uploaded file if DB insertion fails
            if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting uploaded file after DB fail:", unlinkErr);
                });
            }
            // Provide more specific error feedback if possible (e.g., duplicate entry)
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ error: `Product with ID ${product_ID} already exists.` });
            }
            return res.status(500).json({ error: 'Database error adding product: ' + err.message });
        }
        console.log(`Admin ${req.session.user.username} added product ID: ${product_ID}`);
        res.status(201).json({ message: 'Product added successfully!', insertedId: result.insertId }); // Return success message
    });
});

// PUT Update Product (Protected by isAdmin middleware)

//Test admin update product success
//method: PUT
//URL: http://localhost:8003/api/admin/products/1
//body: raw JSON
// {
//     "message": "Product updated successfully!"
// }


//Test admin update product failure
//method: PUT
//URL: http://localhost:8003/api/admin/products/3
//body: raw JSON
//{
//    "error": "Product with ID 3 not found."
//}

//Update Product
router.put('/api/admin/products/:id', isAdmin, upload.single('Product_Image'), (req, res) => {
    const product_ID_param = req.params.id; 
    console.log(`Admin PUT product attempt for ID: ${product_ID_param} by: ${req.session.user.username}`);
    console.log("PUT /api/admin/products/:id body:", req.body);
    console.log("PUT /api/admin/products/:id file:", req.file);


    // Extract data from body
    const { product_Category, Name, label, price, artist, release_date, quantity, Product_Image: existingImageUrl } = req.body;
    // Use new file if uploaded, otherwise use existing image URL from body (if provided), else null
    const Product_Image = req.file ? `/Image/${req.file.filename}` : (existingImageUrl || null);
    const sanitizedReleaseDate = release_date && release_date !== 'null' && release_date !== '' ? release_date : null;
    const admin_ID = req.session.user.admin_ID || 'AD1'; // Get admin ID

     // Basic validation for required fields during update
    if (!Name || !label || !price || !artist || !quantity) {
         // Clean up uploaded file if validation fails
         if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting uploaded file after validation fail (PUT):", err);
            });
        }
        return res.status(400).json({ error: 'Missing required fields: Name, label, price, artist, quantity' });
    }

    const sql = `UPDATE Product SET
                    product_Category=?,
                    Name=?,
                    label=?,
                    price=?,
                    artist=?,
                    release_date=?,
                    quantity=?,
                    Product_Image=?,
                    admin_ID=?
                 WHERE product_ID=?`; // Update based on URL parameter ID

    const params = [
        product_Category || null,
        Name,
        label,
        price,
        artist,
        sanitizedReleaseDate,
        quantity,
        Product_Image,
        admin_ID,
        product_ID_param 
    ];

    Datacon.query(sql, params, (err, result) => {
        if (err) {
            console.error(`Admin: Error updating product ID ${product_ID_param}:`, err);
            
             if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting uploaded file after DB fail (PUT):", unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Database error updating product: ' + err.message });
        }
         
        if (result.affectedRows === 0) {
             console.warn(`Admin: Update attempt for non-existent product ID ${product_ID_param}`);
             
             return res.status(404).json({ error: `Product with ID ${product_ID_param} not found.` });
        }

        console.log(`Admin ${req.session.user.username} updated product ID: ${product_ID_param}`);

        res.status(200).json({ message: 'Product updated successfully!' });
    });
});

//Test admin delete product
//method: delete
//URL: http://localhost:8003/api/admin/products/1
//body: raw JSON
//{
//    "message": "Product deleted successfully!"
//}
// {
//     "product_Category": "Vinyl",
//     "Name": "Abbey Road (Remastered)",
//     "label": "Apple Records",
//     "price": 35.99,
//     "artist": "The Beatles",
//     "release_date": "1970-01-01",
//     "quantity": 120,
//     "Product_Image": "/Image/abbey_road_remastered.jpg"
//   }
  



//Test admin delete product
//method: delete
//URL: http://localhost:8003/api/admin/products/4
//body: raw JSON
//{
//    "message": "Product deleted successfully!"
//}

// {
//     "product_Category": "Fang",
//     "Name": "Ict music",
//     "label": "Apple Records",
//     "price": 35.99,
//     "artist": "The Beatles",
//     "release_date": "1970-01-01",
//     "quantity": 120,
//     "Product_Image": "/Image/abbey_road_remastered.jpg"
//   }
  


//Delete Product
router.delete('/api/admin/products/:id', isAdmin, (req, res) => {
    const product_ID = req.params.id;
    console.log(`Admin DELETE product attempt for ID: ${product_ID} by: ${req.session.user.username}`);

    if (!product_ID) {
        return res.status(400).json({ error: 'Product ID is required for deletion.' });
    }

    
    const selectSql = 'SELECT Product_Image FROM Product WHERE product_ID = ?';
    Datacon.query(selectSql, [product_ID], (selectErr, results) => {
        if (selectErr){
            console.error(`Admin: Error fetching product details before delete (ID: ${product_ID}):`, selectErr);
           
        }

        const imagePathToDelete = results && results.length > 0 && results[0].Product_Image
                                    ? path.join(__dirname, 'public', results[0].Product_Image) 
                                    : null;

        
        const deleteSql = `DELETE FROM Product WHERE product_ID=?`;
        Datacon.query(deleteSql, [product_ID], (err, result) => {
            if (err) {
                console.error(`Admin: Error deleting product ID ${product_ID}:`, err);
                return res.status(500).json({ error: 'Database error deleting product: ' + err.message });
            }

            if (result.affectedRows === 0) {
                console.warn(`Admin: Delete attempt for non-existent product ID ${product_ID}`);
                return res.status(404).json({ error: `Product with ID ${product_ID} not found.` });
            }

            console.log(`Admin ${req.session.user.username} deleted product ID: ${product_ID}`);

            
            if (imagePathToDelete) {
                fs.unlink(imagePathToDelete, (unlinkErr) => {
                    if (unlinkErr) {
                       
                        console.error(`Admin: Failed to delete image file ${imagePathToDelete} after deleting product ID ${product_ID}:`, unlinkErr);
                    } else {
                        console.log(`Admin: Deleted associated image file ${imagePathToDelete}`);
                    }
                });
            }

            res.status(200).json({ message: 'Product deleted successfully!' });
        });
    });
});


app.use(router);


app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    
     if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Access forbidden by CORS policy.' });
    }
    
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

router.get('/AddEdit', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'AddEdit.html'));
});



app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log("__dirname is:", __dirname);
});
