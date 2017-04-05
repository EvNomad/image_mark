var base_url = null;
var rootFolderName = "Great Pics";
var img_urls = [];
var currentNodeId = "1";

// Execute content script on extension icon click
function click(e) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var thisTab = tabs[0];
        chrome.tabs.executeScript(thisTab.id, {file: "content.js"});

    });

}

// Recive message from the content script containing the images array
function processMessage(request, sender, sendResponse) {
    if (request.ext == "imageMark") {
        base_url = sender.tab.url;

        img_urls = request.imgagesArray;
        createFolders(currentNodeId, rootFolderName, 0);
        sendResponse({status: "Done!"});
    }
}

// Create folders recursively and process the bookmarks on max depth
// depth = 0 for rootNode = 'Great Pics'
// depth = 1 for base_url folder
function createFolders(parentId, folderName, depth) {
    chrome.bookmarks.getChildren(parentId, function (children) {
        var exists = false;
        children.forEach(function (node) {
            if (node.title == folderName) {
                exists = true;              
                if (depth < 1) {
                    createFolders(node.id, base_url, 1)
                }
                if (depth == 1)
                    processBookmarks(img_urls, node.id);
            }
        });
        if (!exists) {
            chrome.bookmarks.create({
                parentId: parentId,
                title: folderName
            }, function (newFolder) {
                console.log(folderName + " not found. It was created at ID: " + newFolder.id);
                if (depth < 1) {
                    createFolders(newFolder.id, base_url, 1)
                }
                if (depth == 1)
                    processBookmarks(img_urls, newFolder.id);
            });
        }


    });

}


function processBookmarks(urls, parentId) {
    chrome.bookmarks.getChildren(parentId, function (children) {
        if (children.length != 0) {

            var found = false;
            var not_found = [];

            urls.forEach(function (url) {
                children.forEach(function (node) {
                    if (node.hasOwnProperty('url')) {
                        if (node.url == url)
                            found = true;
                    }

                });

                if (!found)
                    not_found.push(url);

                found = false;
            });

            // create not found bookmarks
            createBookmarks(parentId, not_found);
        }
        else {
            // create all bookmarks
            createBookmarks(parentId, urls);
        }
    });
}

// Create the bookmarks
function createBookmarks(parentId, elements) {
    elements.forEach(function (el) {
        chrome.bookmarks.create({
            url: el,
            title: el,
            parentId: parentId
        });
    });
}

chrome.browserAction.onClicked.addListener(click);
chrome.runtime.onMessage.addListener(processMessage);

