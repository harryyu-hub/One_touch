/**
 * Removes spaces from package name. Open to further formatting
 * 
 * @param {string} packageName package name to format
 */
function formatPackageName(packageName) {
    return packageName.replace(/ /g, '_');
}

/**
 * Re-adds spaces to package name for presenting in DOM
 * 
 * @param {string} packageName package name to format
 */
function cleanPackageName(packageName) {
    return packageName.replace(/_/g, ' ');
}

/**
 * Constructs HTML div for the added package. Div will wrap buttons and package name
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructPkgDiv(packageName) {
    var packageNameClean = cleanPackageName(packageName);
    var pkgdiv = document.createElement('div'); // make div to show data
    pkgdiv.id = packageName;
    pkgdiv.className = 'package';
    pkgdiv.innerHTML =
        '<div class="packageName">' +
            '<h4>' + packageNameClean + '</h4>' +
        '</div>';
    return pkgdiv;
}

/**
 * Constructs HTML div for the package's buttons. 
 * Div will wrap buttons
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructBtnDiv(packageName) {
    var btndiv = document.createElement('div'); // make div to show data
    btndiv.id = packageName + 'Buttons';
    btndiv.className = 'btndiv';
    return btndiv;
}

/**
 * Construct input button for logging to insert into package div
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructLogButton(packageName) {
    var logbtn = document.createElement('input');
    logbtn.id = packageName + 'Logs';
    logbtn.className = 'logbtn';
    logbtn.setAttribute('type', "image");
    logbtn.setAttribute('value', "Show Logs");
    logbtn.setAttribute('src', "https://cdn3.iconfinder.com/data/icons/lexter-flat-colorfull-file-formats/56/log-128.png")
    logbtn.addEventListener('click', () => {
        getShippingData(packageName, logAll);
    });
    return logbtn;
}

/**
 * Construct input button for linking to map to insert into package div
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructMapsButton(packageName) {
    var mapimg = document.createElement('img');
    mapimg.setAttribute('height',30);
    mapimg.setAttribute('width',30);
    mapimg.setAttribute('src',"./images/map_icon.png");
    var maptext = document.createElement('div');
    var maptextnode = document.createTextNode("Location");
    maptext.className = 'mapbtntext';
    maptext.appendChild(maptextnode);
    var mapbtn = document.createElement('button');
    mapbtn.id = packageName + 'Maps';
    mapbtn.className = 'mapbtn';
    mapbtn.setAttribute('type', "submit");
    mapbtn.setAttribute('value', "Show Location");
    mapbtn.appendChild(mapimg);
    mapbtn.appendChild(maptext);
    mapbtn.addEventListener('click', () => {
        getShippingData(packageName, (shippingData) => {
            chrome.tabs.create({url: shippingData.latestLocation.mapsUrl});
        });
    });
    return mapbtn;
}

function constructMessageButton(packageName,phoneNum) {
    var messageimg = document.createElement('img');
    messageimg.setAttribute('height',25);
    messageimg.setAttribute('width',25);
    messageimg.setAttribute('src',"./images/message_icon.png");
    var messagetext = document.createElement('div');
    var messagetextnode = document.createTextNode("Send SMS");
    messagetext.className = 'messagebtntext';
    messagetext.appendChild(messagetextnode);
    var messagebtn = document.createElement('button');
    messagebtn.id = packageName + 'Message';
    messagebtn.className = 'messagebtn';
    messagebtn.setAttribute('type', "submit");
    messagebtn.setAttribute('value', "Send Message");
    messagebtn.appendChild(messageimg);
    messagebtn.appendChild(messagetext);
    messagebtn.addEventListener('click', () => {
        makeMessageRequest(packageName,phoneNum);
    });
    return messagebtn;
}

/**
 * Construct input button for removing the package from storage and the DOM
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructRmvButton(packageName) {
    var rmvimg = document.createElement('img');
    rmvimg.setAttribute('height',30);
    rmvimg.setAttribute('width',30);
    rmvimg.setAttribute('src',"./images/deleteicon.png");
    var rmvtext = document.createElement('div');
    var rmvtextnode = document.createTextNode("Delete");
    rmvtext.className = 'rmvbtntext';
    rmvtext.appendChild(rmvtextnode);
    var rmvbtn = document.createElement('button');
    rmvbtn.id = packageName + 'Remove';
    rmvbtn.className = 'rmvbtn';
    rmvbtn.setAttribute('type', "submit");
    rmvbtn.setAttribute('value', "Remove Package");
    rmvbtn.appendChild(rmvimg);
    rmvbtn.appendChild(rmvtext);
    rmvbtn.addEventListener('click', () => {
        removePackage(packageName);
    });
    return rmvbtn;
}

/**
 * Construct div in which data will be shown in DOM when logged
 * 
 * @param {string} packageName name to append to ID tags
 */
function constructDataDiv(packageName) {
    var datdiv = document.createElement('div');
    datdiv.id = packageName + 'Data';
    datdiv.className = 'datdiv';
    return datdiv;
}

/**
 * Tries to get the saved data for the package after the data
 * from the API call has been saved. Always called after Package's
 * HTML div has been created and added to view to ensure div exists
 * 
 * @param {string} packageName name of package for which to get data
 */
function tryDisplayData(packageName) {
    afterLoad(packageName + 'Data', (datdiv) => {
        getAfterSave(packageName, (shippingData) => {
            console.log('GOT DATA!');

            var statusimg = document.createElement('img');
            statusimg.className = "statusimg";
            statusimg.setAttribute('src',interpretStatus(shippingData).img );
            statusimg.setAttribute('alt',interpretStatus(shippingData).alt );
            statusimg.setAttribute('height',"20");
            statusimg.setAttribute('width', "20");
            // datdiv.innerHTML +=
            //     '<img class="statusimg" src="' + interpretStatus(shippingData).img + '" alt="' +
            //     interpretStatus(shippingData).alt + '" height="20" width="20"> ';
            datdiv.appendChild(statusimg);
            var dropdwnbtn = document.createElement('button');
            dropdwnbtn.className = "dropdown";
            var dropdwnicon = document.createElement('i');
            dropdwnicon.className = "fa fa-caret-down";
            // dropdwnicon.id = 'dropdown';
            dropdwnicon.setAttribute('aria-hidden',"true");
            var packagediv = document.createElement('div');
            packagediv.id = "dropdwn" + packageName;


            packagediv.innerHTML += '<p class="dataline"><span class="packagedetail">ARRIVING </span><span class="packageinfo">' + shippingData.date.fullDate + '</span></p>';
            packagediv.innerHTML += '<p class="dataline"><span class="packagedetail">CURRENTLY </span><span class="packageinfo">' + shippingData.status+ '</span></p>';
            packagediv.innerHTML += '<p class="dataline"><span class="packagedetail">@ </span><span class="packageinfo">' + shippingData.latestLocation.fullLocation+ '</span></p>';

            packagediv.innerHTML += '<p class="dataline packagedetail"><span class="packagedetail">TRACKING NUMBER: </span>' + shippingData.trackingNumber + '</p>';
            // packagediv.innerHTML += '</div>';

            dropdwnbtn.addEventListener('click', () => {
                togglePackageDetail(packageName);
            });
            dropdwnbtn.appendChild(dropdwnicon);
            datdiv.appendChild(dropdwnbtn);
            datdiv.appendChild(packagediv);
            // console.log(datdiv);
        });
    });
}

function togglePackageDetail(packageName) {
    var x = document.getElementById("dropdwn" + packageName);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function displayList() {
    chrome.storage.sync.get(null, (items) => {
        if(items !== undefined && Object.keys(items).length !== 0) {
            for(var item in items) {
                pkgdiv = makePackageHtml(item); // Create and get div
                addToView(pkgdiv); // Add package div to main view
                tryDisplayData(item); // Display shipping data in view
                console.log(pkgdiv)
            }
        }
    });
}

/**
 * Builds and returns all HTML components for the package
 * 
 * @param {string} packageName name of package to construct HTML for
 */
function makePackageHtml(packageName) {
    // Make individual components of package DOM items
    var pkgdiv = constructPkgDiv(packageName);
    var btndiv = constructBtnDiv(packageName);
    // var logbtn = constructLogButton(packageName);
    var mapbtn = constructMapsButton(packageName);
    var rmvbtn = constructRmvButton(packageName);
    var smsbtn = constructSMSButton(packageName);
    var datdiv = constructDataDiv(packageName);
  
    // Add components into main package div
    pkgdiv.appendChild(datdiv);
    pkgdiv.appendChild(btndiv);
    // btndiv.appendChild(logbtn);
    btndiv.appendChild(mapbtn);
    btndiv.appendChild(rmvbtn);
    btndiv.appendChild(smsbtn);

    return pkgdiv;
}

/**
 * Gets tracking data for the given package from UPS API
 * and creates a div to represent test items for package in popup
 * 
 * @param {string} packageName name of package added
 * @param {string} trackNum tracking number for new package
 */
function addPackage(packageName, trackNum) {
    if(packageName != '' && trackNum != '') {
        packageName = formatPackageName(packageName);
    
    // UPS API call to get tracking data
    makeListRequest(packageName, trackNum);
    // Add html component dynamically
    pkgdiv = makePackageHtml(packageName);
    addToView(pkgdiv);
    tryDisplayData(packageName);
    }
    else {
        datdiv.innerHTML += '<p class="dataline">Invalid</p>';
    }

}


/**
 * Creates input button/icon for SMS/Email alerts
 *
 * @param {string} packageName name to append to ID tags
 */
 function constructSMSButton(packageName){
    var smsimg = document.createElement('img');
    smsimg.setAttribute('height',30);
    smsimg.setAttribute('width',30);
    smsimg.setAttribute('src', "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Chat2-128.png");
    
    var smstext = document.createElement('div');
    var smstextnode = document.createTextNode("Text Me");
    smstext.className = 'smsbtntext';
    smstext.appendChild(smstextnode);
    
    var smsbtn = document.createElement('button');
    smsbtn.id = packageName + 'Text';
    smsbtn.className = 'smsbtn';
    smsbtn.setAttribute('type', "submit");
    smsbtn.setAttribute('value', "Text Info");
    smsbtn.appendChild(smsimg);
    smsbtn.appendChild(smstext);
    
    //request a text on click
    smsbtn.addEventListener('click', () => {
        //make request to text
        //makeMessageRequest();

        if(!document.getElementById("textdivID"+packageName)){
            var textdiv = document.createElement('div');
            var phonebtn = document.createElement('button');
            var phoneInput = document.createElement('input');
            phoneInput.id = "phoneID" + packageName;
            phoneInput.className = "phoneID";
            phoneInput.setAttribute('placeholder', "+1(###)-###-####");
            textdiv.id = "textdivID" + packageName;
            textdiv.className = "textdivID";
            phonebtn.id="sendbutton" + packageName;
            phonebtn.className="sendbutton";
            phonebtn.appendChild(document.createTextNode("SEND"));

            textdiv.appendChild(phoneInput);
            textdiv.appendChild(phonebtn);


            document.getElementById(packageName).appendChild(textdiv);

            phonebtn.addEventListener('click', () =>{
                if(phoneInput.value){
                    makeMessageRequest(packageName,phoneInput.value);
                    document.getElementById("textdivID"+packageName).remove();
                }
            });

        }
        else {

            document.getElementById("textdivID"+packageName).remove();
        }


    });

    return smsbtn;

 }








/**
 * Removes given package from the storage and also 
 * removes the div from the DOM
 * 
 * @param {string} packageName name of package to remove
 */
function removePackage(packageName) {
    chrome.storage.sync.remove(packageName, () => {     // remove from storage
        document.getElementById(packageName).remove(); // remove div
        console.log('Removed ' + packageName);
    });
}