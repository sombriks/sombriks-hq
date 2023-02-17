import AWS from "aws-sdk"

export const cleanBucket = (name, keys) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'})
    return new Promise((resolve, reject) => {
        try {
            s3.deleteObjects({
                Bucket: name, Delete: {Objects: keys, Quiet: true}
            }, async (err, data) => {
                if (err) return reject(err)
                return resolve(data)
            })
        } catch (e) {
            return reject(e)
        }
    })
}