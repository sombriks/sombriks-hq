export const checkEnvironment = () => {
    if (!process.env.AWS_BUCKET_NAME
        || !process.env.HQ_DIST_SITE_FOLDER
        || !process.env.AWS_REGION
        || !process.env.AWS_ACCESS_KEY_ID
        || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.log("Please check your environment variables")
        process.exit(1)
    }
    return "ok"
}
