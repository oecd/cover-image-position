$(function(){

var cvr, hdl, img;

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var file = evt.dataTransfer.files[0];
  var imgDiv = document.getElementById('image');
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      imgDiv.innerHTML = "<img id='coverimage' src='"+ e.target.result +"' title='"+escape(theFile.name)+"'/>"
      img = $("#coverimage")[0];
      var w = img.clientWidth;
      var h = img.clientHeight;

      // 850px x 1024px
      var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      hdl = $("#handle");
      cvr = $("#coverimage");

      if (h > vph || w >vph) {
        img.style.top = "300px";
        img.style.left = "300px";
        img.style.height = "500px";
        img.style.width = "auto";
        hdl.css("height", "500px").css("width", "auto");
        hdl.css("top", "300px").css("left", "300px");
      } else {
        img.style.top = Math.round((vph - h) / 2) + "px";
        img.style.left = Math.round((vpw - w) / 2) + "px";
        hdl
          .css("top", Math.round((vph - h) / 2) + "px")
          .css("left", Math.round((vpw - w) / 2) + "px");
      }

      hdl
        .css('height', cvr.height())
        .css('width', cvr.width())
        .css("display", "block");

        hdl.resizable({
          aspectRatio: true,
          autoHide: true,
          alsoResize: "#coverimage",
          handles: 'all',
          resize: function(event, ui) {
            cvr
              .css('left', ui.position.left)
              .css('top', ui.position.top);
          }
        });

        hdl.draggable({
          // containment: "document",
          drag: function(event, ui) {
            cvr
              .css('left', ui.position.left)
              .css('top', ui.position.top);
          }
        });
    };
  })(file);

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);
  // destroy dropZone ...
  dropZone.parentNode.removeChild(dropZone);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

});
