// Main script for gexif
//
// This script will get an image from the input box with id 'file' and will get EXIF data from that image when the button with id 'btn' is clicked.
//
// The output will be in the div with id 'output'
//
var TIFF_FILES_ALLOWED = false;
// Function to throw away the image after we're done with it. We don't want to store other's images.
function throwAway() {
  //============================================================
  // I'm afraid this does nothing: file.delete() is not a function. Javascript will
  // have the file in memory until the website is reloaded
  //============================================================
  //   var file = document.getElementById("file").files[0];
  //   file.delete();
}

// Get the image from the input box when button is clicked and get EXIF data
function getExif() {
  var file = document.getElementById("file").files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    // Create a new image and set that image to the image from the inputbox
    var img = new Image();
    img.src = e.target.result;
    // Function to get our image data
    img.onload = function () {
      EXIF.getData(img, function () {
        console.log(img)
        var output = document.getElementById("output");
        if(TIFF_FILES_ALLOWED === false && document.querySelector("#file").files[0].name.toString().endsWith(".tiff")) { // deny tiff files if variable says so
          output.innerHTML = `<h3>TIFF files are disabled for now.</h3><h6><i><a href="https://github.com/blockarchitech/gexif" target="_blank">Check for updates</a></i></h6>`
          return
        }
        if(EXIF.getTag(this, "Make") == undefined && EXIF.getTag(this, "Model") == undefined && EXIF.getTag(this, "DateTime") == undefined && EXIF.getTag(this, "FNumber") == undefined && EXIF.getTag(this, "ISOSpeedRatings") == undefined && EXIF.getTag(this, "ExposureTime") == undefined) {
          output.innerHTML = "<h3>No data found for this image.</h3>"
          return
        }
        // Our output div is id'd output
        // set our exif data
        output.innerHTML = "<h3>EXIF Data</h3>";
        output.innerHTML += "<p>Make: " + EXIF.getTag(this, "Make") + "</p>";
        output.innerHTML += "<p>Model: " + EXIF.getTag(this, "Model") + "</p>";
        output.innerHTML +=
          "<p>Date: " + EXIF.getTag(this, "DateTime") + "</p>";
        output.innerHTML +=
          "<p>Aperture: " + EXIF.getTag(this, "FNumber") + "</p>";
        output.innerHTML +=
          "<p>ISO: " + EXIF.getTag(this, "ISOSpeedRatings") + "</p>";
        output.innerHTML +=
          "<p>Exposure: " + EXIF.getTag(this, "ExposureTime") + "</p>";
        // If there is GPS data, display it. If not, say there's no GPS data.
        if (EXIF.getTag(this, "GPSLatitude") == undefined) {
          output.innerHTML += "<p>No GPS data found for this image.</p>";
        } else {
          output.innerHTML +=
            "<p>GPS Latitude: " + EXIF.getTag(this, "GPSLatitude") + "</p>";
          output.innerHTML +=
            "<p>GPS Longitude: " + EXIF.getTag(this, "GPSLongitude") + "</p>"; // If there is GPS data, get the coordinates
        }
        const downloadBtn = document.getElementById("download");
        downloadBtn.classList.remove("d-none");
        downloadBtn.onclick = () => {
          downloadJSON(this);
        };
        output.innerHTML +=
          '<p>Need extra data? <button class="btn" id="btn" onclick="extraExifData()">Get Extra Data</button></p>';
      });
    };
  };
  // No idea what this is but it's needed for it to work properly
  // TODO: figure out what this does.
  reader.readAsDataURL(file);
  // Throw away the image data after we're done with it.
  throwAway();
}

/**
 * Ideally you will have a top level variable in this script and instead of just output the data
 * to the <div> you will first store it into that variable, then just stringify that variable and
 * continue. This way you don't have to fetch again all the EXIF information.
 *
 * @param {*} $thisImage reference to the image itself
 */
function downloadJSON($thisImage) {
  const link = document.createElement("a");
  link.download = `exif_data_${new Date().toISOString()}_${
    $thisImage.name
  }.json`;
  const data = JSON.stringify(
    {
      make: EXIF.getTag($thisImage, "Make"),
      model: EXIF.getTag($thisImage, "Model"),
      date: EXIF.getTag($thisImage, "DateTime"),
      aperture: EXIF.getTag($thisImage, "FNumber"),
      ISO: EXIF.getTag($thisImage, "ISOSpeedRatings"),
      exposure: EXIF.getTag($thisImage, "ExposureTime"),
      gps_latitude: EXIF.getTag($thisImage, "GPSLatitude"),
      gps_longitude: EXIF.getTag($thisImage, "GPSLongitude"),
      gps_longitude: EXIF.getTag($thisImage, "GPSLongitude"),
      gps_altitude: EXIF.getTag($thisImage, "GPSAltitude"),
      gps_altitude_ref: EXIF.getTag($thisImage, "GPSAltitudeRed"),
      gps_date_stamp: EXIF.getTag($thisImage, "GPSDateStamp"),
      gps_time_stamp: EXIF.getTag($thisImage, "GPSTimeStamp"),
      gps_processing_method: EXIF.getTag($thisImage, "GPSProcessingMethod"),
    },
    null,
    2
  );
  const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
  link.href = dataString;
  link.click();
  link.remove();
}

// Get extra information that one might not want
function extraExifData() {
  // This function is *exactly* the same as the one above. It just displays other information.
  var file = document.getElementById("file").files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      EXIF.getData(img, function () {
        // get our extra exif data
        var output = document.getElementById("extradata");
        output.innerHTML = "<h3>Extra EXIF Data</h3>";
        output.innerHTML +=
          "<p>Focal Length: " + EXIF.getTag(this, "FocalLength") + "</p>";
        output.innerHTML += "<p>Flash: " + EXIF.getTag(this, "Flash") + "</p>";
        output.innerHTML +=
          "<p>GPS Altitude: " + EXIF.getTag(this, "GPSAltitude") + "</p>";
        output.innerHTML +=
          "<p>GPS Altitude Ref: " +
          EXIF.getTag(this, "GPSAltitudeRef") +
          "</p>";
        output.innerHTML +=
          "<p>GPS Date: " + EXIF.getTag(this, "GPSDateStamp") + "</p>";
        output.innerHTML +=
          "<p>GPS Time: " + EXIF.getTag(this, "GPSTimeStamp") + "</p>";
        output.innerHTML +=
          "<p>GPS Processing Method: " +
          EXIF.getTag(this, "GPSProcessingMethod") +
          "</p>";
      });
    };
  };
  // Again, zero idea what this does, but it's needed.
  reader.readAsDataURL(file);
  // Throw away the image data after we're done with it.
  throwAway();
}
