import fs from "fs"

export const del = (path) => {
    console.log(`deleting ${path}`)
    fs.rmSync(path, { recursive: true, force: true });
    console.log("done")
}

