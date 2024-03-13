import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

// Disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req, res) => {
    if (req.method === 'POST') {

        // Parse form with a Promise wrapper
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        try {
            const imageFile = data.files.image[0];
            const pathToWriteImage = './public/img/' + imageFile.originalFilename;
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
};