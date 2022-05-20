import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import nc from 'next-connect'

const upload = multer({
  storage: multer.diskStorage({
    destination: './',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
})

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = (req, res) => {
  const filepath = path.resolve(__dirname, '../../upload/')
  const upload = multer({ dest: `${filepath}/` })
  console.log(upload.dest)
  upload.single('file')
}

const get = (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', 'attachment; filename=download_test.txt')
  res.status(200).send('aaa')
}

export default (req, res) => {
    req.method === 'POST'
    ? post(req, res)
    : req.method === 'GET'
    ? get(req, res)
    : res.status(404).send("")
  }
  