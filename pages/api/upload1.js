const formidable = require('formidable');
const fs = require('fs');

export const config = {
    api: {
        bodyParser: false,
    },
};

const readfile = (req) => {
    const options = {};
    options.uploadDir = path.join(process.cwd(), '/public/img');
    options.maxFileSize = 5 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        })
    })
}

export default async function handler(req, res) {
    // if (req) {


    await fs.readdir(path.join(process.cwd() + '/public/img'))
    await readfile(req);
    res.json({ done: "ok" });

    // // try {
    // const form = new IncomingForm();
    // // form.maxFileSize( 5 * 1024 * 1024 );
    // const files = await new Promise((resolve, reject) => {
    //     form.parse(req, function (err, fields, files) {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(files);
    //         }
    //     });
    // });

    // if (err) {
    //     res.status(500).json({ error: 'File size exceeding 5MB' });
    //     return;
    // }
    // const file = files[0];
    // const newpath = './public/img/' + file.originalFilename;
    // fs.rename(file.filepath, newpath, function (err) {
    //     if (err) {
    //         res.status(500).json({ error: 'Error occurred during file upload' });
    //         return;
    //     }
    // });
    // res.status(200).json({ success: true });
    // // form.parse(req, function (err, fields, files) {
    // //     if (err) {
    // //         res.status(500).json({ error: 'File size exceeding 5MB' });
    // //         return;
    // //     }
    // //     // res.status(500).json({ files });
    // //     // return;
    // //     const file = files.image;
    // //     const newpath = './public/img/' + file.originalFilename;
    // //     fs.rename(file.filepath, newpath, function (err) {
    // //         if (err) {
    // //             res.status(500).json({ error: 'Error occurred during file upload' });
    // //             return;
    // //         }
    // //         res.status(200).json({ success: true });
    // //     });
    // // });
    // // } catch (error) {
    // //     console.error(error);
    // //     res.status(500).json({ error: 'Server error' });
    // // }
    // } else {
    //     res.status(405).json({ error: 'Method not allowed' });
    // }
}