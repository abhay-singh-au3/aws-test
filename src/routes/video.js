import { Router } from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const router = Router();

aws.config.update({
    secretAccessKey: process.env.AWS_S3_SECRET,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
})

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            if (file.mimetype.split('/')[0] !== 'video') {
                cb(new Error('Please send files of video format only!'))
            } else {
                const ext = file.mimetype.split('/')[1];
                cb(null, process.env.AWS_S3_BUCKET_NAME + '/' + file.fieldname + '-' + Date.now() + '.' + ext); //use Date.now() for unique file keys
            }
        },
    })
})

const videUpload = upload.single('file');

const uploadMiddleware = (req, res, next) => {
    videUpload(req, res, (err) => {
        if (err) {
            return res.status(422).json({
                success: false,
                message: err.message
            });
        }
        next();
    })

}

router.post('/upload', uploadMiddleware, async (req, res) => {
    if (!(req.file && req.file.key)) {
        return res.status(400).send({
            success: false,
            message: 'Please upload a video file'
        });
    }

    try {

        const video = await req.context.models.Video.create({
            url: req.file.location,
        });


        return res.status(200).send(video);
    } catch (error) {
        return res.status(500).send({ message: 'Something went wrong!' })
    }
})

router.get('/', async (req, res) => {

    try {
        const videos = await req.context.models.Video.findAll();
        return res.status(200).send(videos);
    } catch (error) {
        return res.status(500).send({ message: 'Something went wrong!' })
    }

});

export default router;