import fs from "fs"
import AWS from "aws-sdk"
import mime from "mime-types"
import {exec} from "child_process"

if(!process.env.AWS_BUCKET_NAME
    || !process.env.HQ_DIST_SITE_FOLDER
    || !process.env.AWS_REGION
    || !process.env.AWS_ACCESS_KEY_ID
    || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("Please check your environment variables")
    process.exit(1)
}

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// TODO see https://github.com/sombriks/sample-static-site-on-s3-example
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascript/example_code/s3/s3_photoExample.js
// https://stackoverflow.com/a/70525200/420096
// https://stackoverflow.com/a/35673266/420096
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-function-add-index.html

exec(`find ${process.env.HQ_DIST_SITE_FOLDER} -type f`, (err, stdout, stderr) => {
    if (err) return console.log(err);
    if (stderr) return console.log(err)
    const newsite = stdout.split("\n").filter(f => f !== "")
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
                let newKey = newsite[f].split(`${process.env.HQ_DIST_SITE_FOLDER}/`).join("")
                console.log("uploading ", newKey)
                await s3.upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: newKey,
                    ContentType: mime.lookup(newKey) || "text/html",
                    Body: fs.createReadStream(newsite[f])
                }).promise()
            }
            console.log("done")
        })
    })

})