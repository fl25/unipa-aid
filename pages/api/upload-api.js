import nextConnect from "next-connect";
import multer from "multer";
import fs from 'fs';
import xlsx from 'xlsx';

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

const upload = multer({
    storage: multer.diskStorage({
        destination: 'upload',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

let downloadData;

export default nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happend! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})
    .use(upload.single('upload'))
    .post((req, res) => {
        const isXlsx = req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXlsx) throw new Error(`MIME type is not 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'`);
        const jsonData = xlsxToJson(req.file.path);
        fs.unlinkSync(req.file.path);
        res.status(200).json(jsonData);
    });

const  xlsxToJson = (filepath) => {
    const book = xlsx.readFile(filepath);
    const sheet = book.Sheets[book.SheetNames[0]];
    const sheet_json = xlsx.utils.sheet_to_json(sheet);
    return sheet_json;
};

