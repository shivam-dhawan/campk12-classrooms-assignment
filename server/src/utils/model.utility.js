'use strict';

function generateThumnailUrl(imageDoc) { return imageDoc; }

async function updateThumbnails(object, listOfImageKeys) {
  if (object.isNew() || object.isModified()) {
    for (let key of listOfImageKeys) {
      if (object.isModified(key)) {
        let pathList = key.split('.');
        let docObj = {};
        switch (pathList.len()) {
          case 1:
            docObj = object[pathList[1]];
            object[pathList[1]] = generateThumnailUrl(docObj);
            break;
          case 2:
            docObj = object[pathList[1]][pathList[2]];
            object[pathList[1]][pathList[2]] = generateThumnailUrl(docObj);
            break;
          case 3:
            docObj = object[pathList[1]][pathList[2]][pathList[3]];
            object[pathList[1]][pathList[2]][pathList[3]] = generateThumnailUrl(docObj);
            break;
          case 4:
            docObj = object[pathList[1]][pathList[2]][pathList[3]][pathList[4]];
            object[pathList[1]][pathList[2]][pathList[3]][pathList[4]] = generateThumnailUrl(docObj);
            break;
        }
      }
    }
  }

  return object;
}

// Note pre update has query instance, use this._update <- doc in pre hook, and call next()

module.exports = {
  updateThumbnails,
};


