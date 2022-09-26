
function getExcelWorkbook(fileObject) {

    let deferred = new $.Deferred();
    let workbook = null;

    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    if (regex.test(fileObject.name.toLowerCase())) {

        if (typeof (FileReader) != "undefined") {

            // Create a new FileReader object
            let fileReader = new FileReader();

            
            // For Browsers other than IE.
            if (fileReader.readAsBinaryString) {

                fileReader.readAsBinaryString(fileObject);
                fileReader.onload = function (event) {

                    let data = event.target.result;
                    //Read the Excel File data.
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    deferred.resolve(workbook);
                };


            } else {
                // For IE Browser.
                fileReader.readAsArrayBuffer(fileObject);
                fileReader.onload = function (event) {
                    var data = "";
                    var bytes = new Uint8Array(event.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    //Read the Excel File data.
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    deferred.resolve(workbook);
                };
            }

        } else {
            alert("This browser does not support HTML5.");
        }

    } else {
        alert("Please upload a valid Excel file.");
    }
    return deferred.promise();

}

async function getUserId() {
    try {
        const user = await $.ajax({
            method: 'GET',
            url: '/current-user'
        });
        return user.userId;
        
    } catch (error) {
        console.log(error);
    }
}

async function fetch(url) {
    const result = await $.ajax({
        method: 'GET',
        url: url,
        success: function (result) {
        }
    });
    return result;
}

export { 
    getExcelWorkbook,
    getUserId,
    fetch
};