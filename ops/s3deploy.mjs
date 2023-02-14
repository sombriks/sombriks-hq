import fs from "fs"
import AWS from "aws-sdk"
import {exec} from "child_process"

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exec(`find dist -type f`, (err, stdout, stderr) => {
    if (err) return console.log(err);
    if (stderr) return console.log(err)
    const newsite = stdout.replace(/dist\//g, "").split("\n")
    console.log(newsite)
    s3.listObjects({Bucket: process.env.AWS_BUCKET_NAME}, (err, data) => {
        if (err) return console.log(err);
        console.log(data)
        s3.deleteObjects({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {Objects: data.Contents.map(({Key}) => ({Key})), Quiet: true}
        }, async (err, data) => {
            if (err) console.log(err);
            console.log(data)
            for (let f in newsite) {
                s3.upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: newsite[f],
                    Body: fs.createReadStream("./dist/"+newsite[f])
                })
            }
        })
    })

})