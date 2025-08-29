const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

// For Vercel deployment, we'll use memory storage and store file data in database
let storage = multer.memoryStorage();

let upload = multer({ 
  storage, 
  limits:{ fileSize: 1000000 * 100 }, // 100MB limit
}).single('myfile'); 

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }
      
      try {
        const file = new File({
            filename: req.file.originalname || req.file.filename,
            originalFilename: req.file.originalname,
            fileData: req.file.buffer, // Store file data in database
            contentType: req.file.mimetype,
            uuid: uuidv4(),
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).send({ error: 'Error saving file to database' });
      }
    });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
  
    const sendMail = require('../services/email');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'CO-LAB file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/mailTemp')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}

});

module.exports = router;