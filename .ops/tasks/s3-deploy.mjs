import {checkEnvironment} from "../s3/base.mjs";
import {listLocalFiles} from "../local/file-list.mjs";
import {cleanBucket} from "../s3/s3-del.mjs";
import {listBucketObjects} from "../s3/s3-list.mjs";
import {upload} from "../s3/s3-upload.mjs";

checkEnvironment()

const deploy = async () => {
    console.log("listing files to deploy...")
    const files = await listLocalFiles(process.env.HQ_DIST_SITE_FOLDER)
    console.log(files)
    console.log("cleaning bucket...")
    const objectsToRemove = await listBucketObjects(process.env.AWS_BUCKET_NAME)
    const cleaningResult = await cleanBucket(process.env.AWS_BUCKET_NAME, objectsToRemove.Contents.map(({Key}) => ({Key})))
    console.log(cleaningResult)
    console.log("uploading files...")
    const deployResult = await upload(process.env.AWS_BUCKET_NAME, process.env.HQ_DIST_SITE_FOLDER, files)
    console.log(deployResult)
}

deploy()
