var fs = require('fs');

// ++++     YOUR DATA HERE     ++++
// --------------------------------
// YOUR VIEWBOX (get this from your ./input/target.svg data)
const viewbox = [0, 0, 483, 823]
// YOUR MAP COORDINATES HERE (lat/long of the svg viewbox corners, if you project it into desired map location)
const x1 = -7.568118
const y1 = 60.978780
const x2 = -0.436628
const y2 = 54.506637
// YOUR CORRECTION FACTORS (fix those small alignment issues if prev lat/long not precise enough)
const offsetX = -0.05
const offsetY = 0.1
const sizeOffsetX = 1
const sizeOffsetY = 1
// ---------------------------------

let rawdata = fs.readFileSync('./output/coordinates.json');
let coordsArray = JSON.parse(rawdata);

// Utility function to produce lat lng data from coords array
function createLatLong(coordsArray) {
    
    function toLatLong(x, y) {
        // Aligned map viewbox coords (lat, lng)
        const mapX1 = x1 + offsetX
        const mapY1 = y1 + offsetY
        const mapX2 = x2 + offsetX
        const mapY2 = y2 + offsetY
        
        // Map size (lat, lng)
        const mapWidth = (mapX2 - mapX1) * sizeOffsetX
        const mapHeight = (mapY2 - mapY1) * sizeOffsetY

        // Position of point as ratio of viewbox dimensions
        const ratioX = x / (viewbox[2] - viewbox[0])
        const ratioY = y / (viewbox[3] - viewbox[1])

        // Position of point projected onto aligned map viewbox
        const lng = mapX1 + ratioX * mapWidth
        const lat = mapY1 + ratioY * mapHeight

        // Rounding
        const precision = 1000000

        return {
            lat: Math.floor( lat * precision) / precision,
            lng: Math.floor( lng * precision) / precision,
        }
    }

    // Reduce the path to an array of lat-lng objects
    function pathReducer(acc, curr, idx, src) {
        if (idx % 2) {
            const x = src[idx - 1]
            const y = curr
            return [...acc, toLatLong(x, y)]
        } else {
            return acc
        }
    }
    
    let shapeArray = []
    function initShape(key, coords) {
        const path = [...coords].reduce(pathReducer, [])
        // setToMap(path, map)
        shapeArray = [...shapeArray, { [key]: path} ]
    }

    Object.entries(
        coordsArray
    ).forEach(([key, value]) => initShape(key, value))

    return shapeArray
}

const resultArray = createLatLong(coordsArray)


// Output array to files
resultArray.forEach((value) => {
    const key = Object.keys(value)[0]
    const output = JSON.stringify(value)
    fs.writeFileSync(`./output/${key}.json`, output);
})
