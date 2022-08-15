require("process");
let request = require("request"),
    fs = require("fs"),
    path = require("path"),
    gphoto2 = require('gphoto2'),
    Index = new gphoto2.GPhoto2();

let apiKey = "327300af-a5f2-4fbc-b947-ab4aba139cf0";
let apiURL = "https://stage.metareal.com/api/1.12";

// let projectID = "895f25d4-0fe9-4afa-b901-bcbe2213d047";  // for project: `testAPI`
let projectID = "4d2618d3-6bf3-4bb9-abbd-8e55d3d8e917";  // for project: `GlobalDWS Office`

// Negative value or undefined will disable logging, levels 0-4 enable it.
Index.setLogLevel(1);
Index.on('log', function (level, domain, message) {
    console.log(domain, message);
});

/* MAIN CODE */
captureImage()

/* Capture a panorama image using the Ricoh Theta Z1 camera and then upload to */
function captureImage() {
    try {
        // List cameras / assign list item to variable to use below options
        Index.list(function (list) {
            if (list.length === 0) return;
            let camera = list[0];
            console.log('Found', camera.model);

            // Take picture and store in camera and get its path
            console.log('Capturing image with', camera.model)
            camera.takePicture({download: false},
                function (er, path) {
                    console.log(path);

                    // Download a picture from camera using the path above
                    camera.downloadPicture({
                        cameraPath: path,
                        targetPath: '/tmp/foo.XXXXXX'
                    }, function (er, tmpname) {
                        fs.renameSync(tmpname, __dirname + "/picture.jpg");

                        let oldPath = __dirname + "/picture.jpg";
                        let newPath = __dirname + "/" + String(path.split("/")[4]);

                        // Rename image to the original name from Ricoh Theta Z1
                        try {
                            console.log('Downloading the image to working directory');
                            fs.renameSync(oldPath, newPath);
                        } catch (err) {
                            console.log('Error renaming the file picture.jpg');
                            console.log(err)
                        }

                        // Upload image to MetaReal
                        try {
                            console.log('Uploading the image to MetaReal');
                            return Promise.all([
                                uploadImage(newPath)
                        ])
                        } catch (errr) {
                            console.log('Error uploading the image to MetaReal');
                            console.log(errr)
                        }
                    });
                }
            );
        });
    } catch (e) {
        console.log("Could not capture and upload image");
        console.log(e);
    }
}

// Upload captured image to MetaReal project's panorama folder
function uploadImage(imagePath) {
    return new Promise((resolve, reject) => {
        let readFileStream = fs.createReadStream(imagePath);
        let filename = path.basename(imagePath);

        request.post({
            url: apiURL + "/project/" + projectID + "/panorama/" + filename,
            body: readFileStream,
            headers: {"apikey": apiKey}
        }, (error, response, body) => {
            if (error) {
                console.error(error);
                reject();
            } else {
                /* IMPORTANT, because we don't set the request as a JSON type */
                /* We need to parse the body, because it will be sent as text */
                body = JSON.parse(body);
                if (body.result === "Success") {
                    resolve();
                } else {
                    reject(body);
                }
            }
        });
    });
}