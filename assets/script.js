/* global FileReader Image interact html2canvas saveAs */
window.onload = function () {
  var oHeight, oWidth
  var dropZone = document.getElementById('dropzone')
  var stats = document.getElementById('stats')
  var filename = 'cover-position-screenshot.png'

  function updateStats (img) {
    const rect = img.getBoundingClientRect()
    stats.querySelectorAll('div#height span')[0].innerHTML = Math.round(rect.height)
    stats.querySelectorAll('div#width span')[0].innerHTML = Math.round(rect.width)
    stats.querySelectorAll('div#top span')[0].innerHTML = Math.round(rect.top)
    stats.querySelectorAll('div#left span')[0].innerHTML = Math.round(rect.left)
    stats.querySelectorAll('div#zoom span')[0].innerHTML = Math.round(rect.width * 100 / oWidth)
  }

  function handleFileSelect (evt) {
    evt.stopPropagation()
    evt.preventDefault()

    var file = evt.dataTransfer.files[0]
    var reader = new FileReader()
    // Read in the image file as a data URL.
    reader.readAsDataURL(file)

    reader.onloadend = function (e) {
      var img = new Image()
      img.src = e.target.result
      img.setAttribute('id', 'coverimage')
      img.setAttribute('title', escape(file.name))
      document.getElementById('container').appendChild(img)

      img.onload = function () {
        oWidth = this.width
        oHeight = this.height

        var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        var vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        // these are thee coordinates for the optical centre of the template.png
        var coverCenterX = 319
        var coverCenterY = 520

        // resize images bigger than the viewport
        if (oHeight > vph || oWidth > vpw) {
          img.style.height = '500px'
          img.style.width = 'auto'
        }

        img.style.top = Math.round(coverCenterY - (this.height / 2)) + 'px'
        img.style.left = Math.round(coverCenterX - (this.width / 2)) + 'px'

        interact('#coverimage')
          .resizable({
            preserveAspectRatio: true,
            invert: 'none',
            edges: { left: true, right: true, bottom: true, top: true },
            // minimum size
            restrictSize: {
              min: { width: 100, height: 50 }
            },
            inertia: true
          })
          .draggable({
            onmove: window.dragMoveListener,
            restrict: {
              restriction: 'parent'
            }
          })
          .on('resizemove', function (event) {
            const target = event.target
            let x = (parseFloat(target.getAttribute('data-x')) || 0)
            let y = (parseFloat(target.getAttribute('data-y')) || 0)

            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top

            target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px,' + y + 'px)'

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            updateStats(target)
          })

        // display a button to reset and the statistics
        document.getElementById('reset').style.display = 'block'
        document.getElementById('stats').style.display = 'block'
        updateStats(img)
      }

      // destroy dropZone ...
      dropZone.parentNode.removeChild(dropZone)
    }
  }

  function handleDragOver (evt) {
    evt.stopPropagation()
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  dropZone.addEventListener('dragover', handleDragOver, false)
  dropZone.addEventListener('drop', handleFileSelect, false)

  function dragMoveListener (event) {
    const target = event.target
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
    updateStats(target)
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener

  stats.addEventListener('click', function (e) {
    stats.contentEditable = true
    window.getSelection().selectAllChildren(stats)
  })
  document.querySelector('#info i').addEventListener('click', function (e) {
    console.log(`click on info button`)
  })
  document.querySelector('#save i').addEventListener('click', function (e) {
    console.log(`click on save button`)
    filename = `${document.getElementById('maintitle').innerText}.png`
    const container = document.querySelector('#container')
    html2canvas(container, {width: 639, height: 837}).then(
      (canvas) => {
        canvas.toBlob(function (blob) {
          saveAs(blob, filename)
        })
      },
      (err) => {
        console.log(`Error: ${err}`)
      })
  })
  // Get the modal
  var modal = document.getElementById('info-content')
  // Get the button that opens the modal
  var btn = document.getElementById('info')
  // Get the <span> element that closes the modal
  var closeButton = document.getElementsByClassName('close')[0]
  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block'
  }
  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function () {
    modal.style.display = 'none'
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }
}
