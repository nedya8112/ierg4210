const sqlite3 = require('sqlite3').verbose();
import { open } from "sqlite";

export default async function handler(req, res) {
    //connect to DB
    const db = await open({
        filename: "./mall.db", // Specify the database file path
        driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });

    if (req.method === 'GET') {
        try {
            // Fetch categories and products from the database
            const categories = await db.all('SELECT * FROM categories');
            const products = await db.all('SELECT * FROM products');

            // Close the database connection
            await db.close();

            res.status(200).json({ categories, products });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else if (req.method === 'POST') {
        try {
            // Access the form data from req.body and perform the necessary database operations
            const { type } = req.body;

            // ADD
            if (type === 'add-category') {
                const { name, image } = req.body;
                await db.run('INSERT INTO categories (name, image) VALUES (?, ?)', name, image);
            } else if (type === 'add-product') {
                const { cid, name, price, description, quantity, image } = req.body;
                await db.run('INSERT INTO products (cid, name, price, description, quantity, image) VALUES (?, ?, ?, ?, ?, ?)',
                    cid, name, price, description, quantity, image
                );
            }
            // DELETE
            else if (type === 'delete-category') {
                const { cid } = req.body;
                await db.run('DELETE FROM categories WHERE cid = (?)', cid);
            } else if (type === 'delete-product') {
                const { pid } = req.body;
                await db.run('DELETE FROM products WHERE pid = (?)', pid);
            }

            // EDIT
            else if (type === 'edit-category') {
                const { cid, name } = req.body;
                await db.run('UPDATE categories SET name = (?) WHERE cid = (?)', name, cid);
            } else if (type === 'edit-product') {
                const { pid, cid, name, price, description, quantity } = req.body;
                await db.run('UPDATE products SET cid = (?), name = (?), price = (?), description = (?), quantity = (?) WHERE pid = (?)',
                    cid, name, price, description, quantity, pid
                );
            }
            else {
                res.status(400).json({ error: 'Invalid form type' });
                return;
            }
            // Close the database connection
            await db.close();

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
