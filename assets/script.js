/* global FileReader Image interact */
window.onload = function () {
  var oHeight, oWidth
  var dropZone = document.getElementById('dropzone')
  var stats = document.getElementById('stats')

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
      dropZone.parentNode.appendChild(img)

      img.onload = function () {
        // img = document.getElementById('coverimage')
        oWidth = this.width // img.clientWidth
        oHeight = this.height // img.clientHeight

        // 850px x 1024px
        var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        var vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        // resize images bigger than the viewport
        if (oHeight > vph || oWidth > vpw) {
          img.style.height = '500px'
          img.style.width = 'auto'
        }

        var newWidth = img.width
        var newHeight = img.height

        img.style.top = Math.round((vph - newHeight) / 2) + 'px'
        img.style.left = Math.round((vpw - newWidth) / 2) + 'px'

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

        // display a button to reset
        // $('a#reset').css('display', 'block')
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

  // $('div#stats').on('click', function () {
  //   $('div#copypaste textarea').val($('div#stats').text()).select()
  //   $('div#copypaste').dialog()
  // })
}
