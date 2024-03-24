import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { csrf } from '../../lib/csrf.js';

// Disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

export default csrf(async (req, res) => {
    if (req.method === 'POST') {
        try {
            // Parse form with a Promise wrapper
            const data = await new Promise((resolve, reject) => {
                const form = new IncomingForm();
                form.maxFileSize = 5 * 1024 * 1024;
                form.on('file', (field, file) => {
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!allowedTypes.includes(file.mimetype)) {
                        throw new Error('Invalid file type');
                    }
                });
                form.parse(req, (err, fields, files) => {
                    if (err) return reject(err);
                    resolve({ fields, files });
                });
            });

            const imageFile = data.files.image[0];
            const pathToWriteImage = './public/img/' + path.basename(imageFile.originalFilename).replace(/ /g, "_").replace(/[^a-zA-Z0-9_.-]+/g, "");
            fs.rename(imageFile.filepath, pathToWriteImage, function (err) {
                if (err) {
                    res.status(500).json({ error: 'Error occurred during file upload' });
                    return;
                }
            });
            //store path in DB
            res.status(200).json({ message: 'Image uploaded!', success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
});