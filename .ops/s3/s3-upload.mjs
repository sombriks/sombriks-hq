import mime from "mime-types"
import AWS from "aws-sdk"
import fs from "fs"

export const upload = async (name, prefix, files) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'})
    const results = []
    try {
        for(let f in files) {
            let newKey = files[f].split(`${prefix}/`).join("")
            results.push(await s3.upload({
                ContentType: mime.lookup(newKey) || "text/html",
                Body: fs.createReadStream(files[f]),
                Bucket: name,
                Key: newKey,
            }).promise())
        }
    } catch (e) {
        results.push(e)
    }
    return results
}