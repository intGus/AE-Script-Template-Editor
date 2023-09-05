// CITY Furniture Template Modifier v0

// UI Setup
var window = new Window("palette", "CF Editor", undefined)
window.orientation = "column"
var text = window.add("statictext", undefined, "Edit text and press OK")

var textGroup = window.add("group", undefined, "")
textGroup.orientation = "column"

// Main
function fileFilter(file) {

    if (!file instanceof Folder) return true

    index = file.name.lastIndexOf(".")
    ext = file.name.substring(index + 1)
    if (ext == 'jpeg') {
        return true
    }
    return false
}

layers = []
text = []
buttons = []
images = []
scaleSliders = []
xPosSliders = []
yPosSliders = []

if (app && app instanceof Application) {
    var activeComp = app.project.activeItem;
    if (activeComp instanceof CompItem) {
        findTextLayers(activeComp)  
    } else {
        alert("Please select a composition")
    }
} else {
    alert("Adobe After Effects is not running")
}

// Callbacks for UI controls
for (var j = 0; j < text.length; j++) {
    (function(index) {
        text[index].onChanging = function() {
            // jpegFile = File.openDialog('Select a new image/video', fileFilter);
            layers[index].property("Source Text").setValue(this.text);
        };
    })(j);
}

for (var j = 0; j < buttons.length; j++) {
    (function(index) {
        buttons[index].onClick = function() {
            jpegFile = File.openDialog('Select a new image/video', fileFilter);
            if (jpegFile) {
                images[index].source.replace(jpegFile)
                scaleSliders[index].value = 100
                images[index].property("ADBE Transform Group").property("ADBE Scale").setValue([100, 100])
                buttons[index].text = File.decode(jpegFile.name)
            } 
        };
    })(j);
}

for (var j = 0; j < scaleSliders.length; j++) {
    (function(index) {
        scaleSliders[index].onChanging = function() {
            images[index].property("ADBE Transform Group").property("ADBE Scale").setValue([this.value, this.value])
        };
        xPosSliders[index].onChange = function() {
            var newPosition = images[index].property("ADBE Transform Group").property("ADBE Position").value
            newPosition[0] += this.value
            images[index].property("ADBE Transform Group").property("ADBE Position").setValue(newPosition)
            xPosSliders[index].value = 0
        }
        yPosSliders[index].onChange = function() {
            var newPosition = images[index].property("ADBE Transform Group").property("ADBE Position").value
            newPosition[1] += this.value
            images[index].property("ADBE Transform Group").property("ADBE Position").setValue(newPosition)
            yPosSliders[index].value = 0
        }
    })(j);
}

// Call UI
window.show()
window.center()

// Functions
function findTextLayers(comp) {
    if (comp instanceof CompItem) {
        for (var i = 1; i <= comp.layers.length; i++) {
            var currentLayer = comp.layers[i]
            //alert([currentLayer, currentLayer.name])
            if (currentLayer.name.indexOf("auto") === 0) {
                if (currentLayer instanceof TextLayer) {
                    layers.push(currentLayer)
                    var textGroupItem = window.add("group", undefined, "")
                    textGroupItem.orientation = "row"
                    label = textGroupItem.add("statictext {text: '', characters: 20, justify: 'left'}")
                    label.text = currentLayer.name.substring(4)
                    textBox = textGroupItem.add("edittext", [0,0,250,35], currentLayer.property("Source Text").value, {wantReturn: true, multiline:true, scrolling: true})
                    text.push(textBox)
                } else if (currentLayer.source instanceof FootageItem) {
                    var textGroupItem = window.add("group", undefined, "")
                    textGroupItem.orientation = "row"
                    label = textGroupItem.add("statictext {text: '', characters: 20, justify: 'left'}")
                    label.text = currentLayer.name.substring(4)
                    var rightGroupItem = textGroupItem.add("group", undefined,"")
                    rightGroupItem.orientation = "column"
                    imageButton = rightGroupItem.add("button", [0,0,250,35], File.decode(currentLayer.source.mainSource.file.name))
                    buttons.push(imageButton)
                    images.push(currentLayer)

                    slidersGroup = rightGroupItem.add("group", undefined, "")
                    slidersGroup.orientation = "column"

                    scaleGroup = slidersGroup.add("group", undefined, "")
                    scaleGroup.orientation = "row"
                    label = scaleGroup.add("statictext {text: '', characters: 10, justify: 'left'}")
                    label.text = "Scale"
                    scaleSlider = scaleGroup.add("slider", undefined, 100, 0, 200)
                    scaleSliders.push(scaleSlider)

                    xPosGroup = slidersGroup.add("group", undefined, "")
                    xPosGroup.orientation = "row"
                    label = xPosGroup.add("statictext {text: '', characters: 10, justify: 'left'}")
                    label.text = "X Position"
                    xPosSlider = xPosGroup.add("slider {minvalue: -500, maxvalue: 500, value: 0}")
                    xPosSliders.push(xPosSlider)

                    yPosGroup = slidersGroup.add("group", undefined, "")
                    yPosGroup.orientation = "row"
                    label = yPosGroup.add("statictext {text: '', characters: 10, justify: 'left'}")
                    label.text = "Y Position"
                    yPosSlider = yPosGroup.add("slider {minvalue: -500, maxvalue: 500, value: 0}")
                    yPosSliders.push(yPosSlider)
                }
            }
            if (currentLayer.source instanceof CompItem) {
                findTextLayers(currentLayer.source)
            }
        }
    }
}

