const router = require('express').Router();

const File = require('../models/file');

router.get('/:uuid', async(req, res) =>{
     const file = await File.findOne({uuid: req.params.uuid});
     if(!file){
        return res.render('download', {error:'Link has been Expired'});
     }

     // For Vercel deployment, serve file from database
     if (file.fileData) {
        res.set({
            'Content-Type': file.contentType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.originalFilename || file.filename}"`,
            'Content-Length': file.size
        });
        res.send(file.fileData);
     } else if (file.path) {
        // Fallback for existing files with path
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
     } else {
        res.status(404).send('File not found');
     }
});
module.exports = router;