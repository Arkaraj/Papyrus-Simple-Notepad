//Lots of variables to edit!!!

let textfield = document.querySelector("#text");
let notepad = document.querySelector(".notepad");
//textfield.style.background = "#FFBDA3";
let yellow = document.querySelector("#yellow");
let blue = document.querySelector("#blue");
let pink = document.querySelector("#pink");
let green = document.querySelector("#green");
let black = document.querySelector("#black");
let bullet = document.querySelector("#bullets");
let clear = document.querySelector("#clear");

// let clr = document.querySelector("#clr");
// let pick = document.querySelector("#pick");
// let hex = document.querySelector("#hex");

yellow.addEventListener('click', () => {
    textfield.style.background = "#F7E999";
    textfield.style.color = "#4b453c";
    textfield.focus();
});
blue.addEventListener('click', () => {
    textfield.style.background = "#b9dcf4";
    textfield.style.color = "#4b453c";
    textfield.focus();
});
pink.addEventListener('click', () => {
    textfield.style.background = "#FFBDA3";
    textfield.style.color = "#4b453c";
    textfield.focus();
});
green.addEventListener('click', () => {
    textfield.style.background = "#00F993";
    //#CAF4B9
    textfield.style.color = "#4b453c";
    textfield.focus();
});
black.addEventListener('click', () => {
    textfield.style.background = "#3c4265";
    //rgba(61, 67, 102, 0.8)
    textfield.style.color = "#fff";
    textfield.focus();
});
bullet.addEventListener('click', () => {
    textfield.value = textfield.value + "●";
    textfield.focus();
});
clear.addEventListener('click', () => {
    textfield.value = "";
    textfield.innerHTML = "";
    textfield.focus();
});

// pick.addEventListener('click', () => {
//     hex.value = clr.value;
// });

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById('text').focus();
});

textfield.onfocus = function () {
    var val = textfield.value; textfield.value = ''; textfield.value = val;
}

// Credits: LUCID for chrome storage api

function updateStore(storeKey, data) {
    let obj = {};
    obj[storeKey] = JSON.stringify(data);
    //console.log(obj[storeKey]);
    chrome.storage.sync.set(obj);
}

function readStore(storeKey, cb) {
    chrome.storage.sync.get(storeKey, result => {
        let d = null

        if (result[storeKey]) d = JSON.parse(result[storeKey])

        // Make sure we got an object back, run callback
        if (typeof d === "object") cb(d)
    });

    // chrome.storage.sync.get(storeKey, result => {
    //     //console.log('Value currently is ' + result.notepadContent);
    // })
}

const key = "thjkljlkjkljrwl";

let defaultData = {
    notepadContent: "",
    notepadclr: "#3c4265",
    fclr: "#fffff"
}



readStore(key, d => {
    let data

    // Check if we got data from the chrome sync storage, if so, no fallback is needed
    if (d) {
        data = d
    } else {
        // Get the local storage
        local = localStorage.getItem(key)

        // Check if we got local storage data
        if (local) {
            // Try parsing the local storage data as JSON.
            // If it succeeds, we had an object in local storage
            try {
                data = JSON.parse(local)
                updateStore(key, local)
            } catch (e) {
                // If it fails to parse, we had the notepad content in local storage
                data = defaultData
                data.notepadContent = localStorage.getItem(key)
                data.notepadclr = localStorage.getItem(key)
                data.fclr = localStorage.getItem(key)
                updateStore(key, data)
            }

            // Delete the local storage
            localStorage.removeItem(key)
        }

        // If we couldn't get data from anywhere, set to default data
        if (!data) {
            data = defaultData
        }
    }

    start(data)

})

function listenerUpdate() {
    readStore(key, d => {
        textfield.innerHTML = d.notepadContent
        textfield.style.background = d.notepadclr
        textfield.style.color = d.fclr
    })
}

function start(data) {
    textfield.innerHTML = data["notepadContent"]
    textfield.style.background = data["notepadclr"]
    textfield.style.color = data["fclr"]

    textfield.addEventListener("input", e => {
        if (textfield !== document.activeElement || !windowIsActive) return

        let obj = Object.assign(data, {
            notepadContent: textfield.value,
            notepadclr: textfield.style.background,
            fclr: textfield.style.color
        })

        updateStore(key, obj)
    })

    notepad.addEventListener("click", e => {
        if (textfield !== document.activeElement || !windowIsActive) return

        let obj = Object.assign(data, {
            notepadContent: textfield.value,
            notepadclr: textfield.style.background,
            fclr: textfield.style.color
        })

        updateStore(key, obj)
    })

    let windowIsActive;

    let storeListener = setInterval(listenerUpdate, 1000);

    window.onfocus = function () {
        windowIsActive = true
    }

    window.onblur = function () {
        windowIsActive = false
        if (storeListener) {
            clearInterval(storeListener)
        }
        storeListener = setInterval(listenerUpdate, 1000)
    }



    textfield.addEventListener("blur", e => {
        if (storeListener) {
            clearInterval(storeListener)
        }
        storeListener = setInterval(listenerUpdate, 1000)
    })

    textfield.addEventListener("focus", e => {
        if (storeListener) {
            clearInterval(storeListener)
        }
    })
}

