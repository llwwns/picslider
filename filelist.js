const _ = require('underscore');
const fs = require('fs');
const path = require('path');

exports.loadFileList = (lst) => {
    let result = lst.map((folder) => {
        let files = fs.readdirSync(folder);
        return files.map((file) => path.join(folder, file));
    });
    let files = _.shuffle(_.flatten(result, true));
    let current = 0;
    return {
        next: () => {
            if (files.length == 0) {
                return null;
            }
            let r = files[current];
            current = (current + 1) % files.length;
            return r;
        },
        error: () => {
            files.splice((current + files.length - 1) % files.length, 1);
            current %= files.length;
        }
    };
}
