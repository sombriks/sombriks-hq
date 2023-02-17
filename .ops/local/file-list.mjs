import FindFiles from "node-find-files"

export const listLocalFiles = (folder) => {
    return new Promise((resolve, reject) => {
        try {

            const allFiles = []
            const finder = new FindFiles({
                rootFolder: folder,
                filterFunction(path, stat) {
                    return stat.isFile()
                }
            })
            finder.on("match", (strPath, stat) => {
                allFiles.push(strPath)
            })
            finder.on("complete", () => {
                resolve(allFiles)
            })
            finder.on("patherror", (err, strPath) => {
                console.log("Error for Path " + strPath + " " + err)
            })
            finder.on("error", function (err) {
                reject(err)
            })
            finder.startSearch()
        } catch (e) {
            reject(e)
        }
    })
}