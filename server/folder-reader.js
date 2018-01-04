const fs = require('fs');
const path = require('path');
const defaultPath = "D:/Users/Erick/Torrents";

class FolderReader {
    constructor(folderName) {
        this.videoExtensions = [".mkv", ".avi", ".mp4", ".wmv"];
        this.finalList = [];
    }

    checkIfFolder(path) {
        let stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    checkIfHasVideos(parentPath, itemList) {
        for (let item of itemList) {
            let subPath = parentPath + "/" + item;
            if (this.checkIfFolder(subPath) === false && this.checkIfVideo(subPath) === true) {
                return true;
            }
        }
        return false; // Found none
    }

    checkIfVideo(filePath) {
        let extension = path.extname(filePath).toLowerCase();
        if (this.videoExtensions.indexOf(extension) !== -1) {
            return true;
        }
        // console.log("Couldn't fit extension " + extension);
        return false;
    }

    readFolder(folderPath, depth = 0) {
        let list = fs.readdirSync(folderPath);
        let hasVideos = false; // True if sub-folder has videos, or it has videos
        list.forEach((listItem) => {
            if (listItem.substr(0,1) === '.') return true;
            let subPath = folderPath + "/" + listItem;
            // console.log("Checking item " + listItem);
            if (this.checkIfFolder(subPath)) {
                // console.log(subPath);
                let subHasVideos = this.readFolder(subPath, depth + 1)
                if (subHasVideos) hasVideos = true;
            }
            else if (depth === 0 && this.checkIfVideo(subPath)) {
                 console.log("Found video " + subPath);
                 this.finalList.push(path.basename(subPath));
            }
        });
        if (!hasVideos && this.checkIfHasVideos(folderPath, list)) {
            hasVideos = true;
        }

        if (depth <= 1 && hasVideos) {
            console.log(`Folder ${folderPath} depth ${depth} has videos in it.`);
            this.finalList.push(path.basename(folderPath));
        }

        return hasVideos;
    }
}

let reader = new FolderReader();
reader.readFolder(defaultPath);
console.log("Final List coming =========");
console.log(reader.finalList);