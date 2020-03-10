Steps for usage:
1. Copy svg data into ./input/target.svg, try to keep same format (sketch output)
    (Any issues at this stage will be handled with dependency "svg-path-interpolator")
2. Enter personalised viewbox svg data, map latLng and any correction factors into ./script.js where signposted
3. command npm run convert
4. check ./output for resulting lat lng JSON files, ready to use with Google maps js api or similar