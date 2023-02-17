import {del} from "../local/del-folder.mjs";
import {checkEnvironment} from "../local/basic-checks.mjs";

checkEnvironment()

del(process.env.HQ_DIST_SITE_FOLDER)
