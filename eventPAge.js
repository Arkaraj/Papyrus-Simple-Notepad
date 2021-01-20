var menuItem = {
    "id": "Ark",
    "title": "Papyrus - Add in the Notepad",
    "contexts": ["selection"]
};

const key = "thisisthelegitkeyforthisproject";

chrome.contextMenus.create(menuItem);

function updateStore(storeKey, data) {
    let obj = {};
    obj[storeKey] = JSON.stringify(data);
    chrome.storage.sync.set(obj);

    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Text Added!",
        message: "The selected text was added to Papyrus Notepad"
    };
    chrome.notifications.create('AddedNotify', notifOptions);

}


chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == "Ark" && clickData.selectionText) {
        if ((clickData.selectionText)) {

            chrome.storage.sync.get(key, result => {
                let data = JSON.parse(result[key]);

                let prevContent = data.notepadContent;

                let obj = Object.assign(data, {
                    notepadContent: prevContent + ' ' + clickData.selectionText,
                });

                updateStore(key, obj)

            });
        }
    }
});

// For Wikipedia 

/* function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    if (clickData.menuItemId == "Wikit" && clickData.selectionText){
        var wikiUrl = "https://en.wikipedia.org/wiki/" + fixedEncodeURI(clickData.selectionText);
        var createData = {
            "url": wikiUrl,
            "type": "popup",
            "top": 5,
            "left": 5,
            "width": screen.availWidth/2,
            "height": screen.availHeight/2
        };
        chrome.windows.create(createData, function(){});
    }
}); */

