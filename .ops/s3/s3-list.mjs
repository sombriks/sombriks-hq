import AWS from "aws-sdk"

export const listBucketObjects = (name) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'})
    return new Promise((resolve, reject) => {
        try {
            s3.listObjects({Bucket: name}, (err, data) => {
                if (err) return reject(err)
                return resolve(data)
            })
        } catch (err) {
            return reject(err)
        }
    });
}