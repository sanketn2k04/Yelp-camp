maptilersdk.config.apiKey = maptilerApiKey;
// const coordinates=[16.62662018, 49.2125578];
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerApiKey}`, // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map)
    