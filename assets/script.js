$(function(){
  var hdl, img, oHeight, oWidth, color;

  function updateStats(img) {
    var stats = $("div#stats");
      stats.find("div#height span").html(img.css("height").replace("px", ""));
      stats.find("div#width span").html(img.css("width").replace("px", ""));
      stats.find("div#top span").html(img.css("top").replace("px", ""));
      stats.find("div#left span").html(img.css("left").replace("px", ""));
      stats.find("div#zoom span").html(Math.round(img.css("width").replace("px", "") * 100 / oWidth));
  }

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var file = evt.dataTransfer.files[0],
        imgDiv = $('div#image'),
        reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        imgDiv.prepend("<img id='coverimage' src='"+ e.target.result +"' title='"+escape(theFile.name)+"'/>");
        img = $("#coverimage");
        oWidth = img.width(); //img.clientWidth;
        oHeight = img.height(); //img.clientHeight;

        // 850px x 1024px
        var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        hdl = $("#handle");

        // resize images bigger than the viewport
        if (oHeight > vph || oWidth > vpw) {
          img.css("height", "500px").css("width", "auto");
          hdl.css("height", "500px").css("width", "auto");
        }

        var newWidth = img.width();
        var newHeight = img.height();

        img
          .css("top", Math.round((vph - newHeight) / 2) + "px")
          .css("left", Math.round((vpw - newWidth) / 2) + "px");
        hdl
          .css("top", Math.round((vph - newHeight) / 2) + "px")
          .css("left", Math.round((vpw - newWidth) / 2) + "px");

        hdl
          .css('height', newHeight)
          .css('width', newWidth)
          .css("display", "block");

          hdl.resizable({
            aspectRatio: true,
            autoHide: true,
            alsoResize: "#coverimage",
            handles: 'all',
            resize: function(event, ui) {
              img
                .css('left', ui.position.left)
                .css('top', ui.position.top);
              updateStats(img);
            }
          });

          hdl.draggable({
            // containment: "document",
            drag: function(event, ui) {
              img
                .css('left', ui.position.left)
                .css('top', ui.position.top);
              updateStats(img);
            }
          });

          // display a button to reset
          $("a#reset").css("display", "block");
          $("div#stats").css("display", "block");
          updateStats(img);
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

  $("div#stats").on("click", function () {
    $("div#copypaste textarea").val($("div#stats").text()).select();
    $("div#copypaste").dialog();
  })
  $("a#reset").button({
    icons: { primary: "ui-icon-refresh"}
  });
});
