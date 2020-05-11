document.addEventListener('DOMContentLoaded', () => {
    origin_selector = document.querySelector('.origin');
    destination_selector = document.querySelector('.destination');

    let count = 0;
    countries_str = sessionStorage.getItem("countries") || "";

    const city = document.createElement('input');
    city.type = "text";
    city.placeholder = "City";
    city.className = "city form-control";

    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.NaturalEarth1();

    // Create map polygon series
    polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.mapPolygons.template.strokeWidth = 0.5;

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = chart.colors.getIndex(0);

    // Create hover state and set alternative fill color
    hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(2);

    // Create active state
    activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = am4core.color("#F05C5C");

    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function (ev) {
        if (count) {
            destination_selector.value = ev.target.dataItem.dataContext.name + " " + ev.target.dataItem.dataContext.id;
            append_city(city, "dest-city", ".destination-city");
            change_color(polygonSeries, polygonTemplate);
            //alert("Don't forget to add the city!")
            count--;
        } else {
            origin_selector.value = ev.target.dataItem.dataContext.name + " " + ev.target.dataItem.dataContext.id;
            append_city(city, "origin-city", ".origin-city");
            change_color(polygonSeries, polygonTemplate);
            //alert("Don't forget to add the city!")
            count++;
        }
    })


    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());


    origin_selector.onchange = () => {
        if (origin_selector.value === "Russian Federation RU") { origin_selector.value = "Russia RU" }
        append_city(city, "origin-city", ".origin-city");
        change_color(polygonSeries, polygonTemplate);
        count++;
    }

    destination_selector.onchange = () => {
        if (origin_selector.value === "Russian Federation RU") { origin_selector.value = "Russia RU" }
        append_city(city, "dest-city", ".destination-city");
        change_color(polygonSeries, polygonTemplate);
        count--;
    }

});

function change_color(polygonSeries, polygonTemplate) {
    const origin = origin_selector.value.split(' ');
    const dest = destination_selector.value.split(' ');
    if (origin_selector.value && destination_selector.value) {
        countries_str += origin_selector.value + ", " + destination_selector.value + ", ";
    }
    origin_id = origin.pop();
    dest_id = dest.pop();
    origin_name = origin[0];
    dest_name = dest[0];
    if (origin.length > 1) { origin_name = origin.join(' ') }
    if (dest.length > 1) { dest_name = dest.join(' ') }
    selected_countries = [{
        "id": origin_id,
        "name": origin_name,
        "value": 100,
        "fill": am4core.color("#F05C5C")
    }, {
        "id": dest_id,
        "name": dest_name,
        "value": 50,
        "fill": am4core.color("#F05C5C")
    }];
    sessionStorage.setItem("countries", countries_str);
    polygonSeries.data = selected_countries;
    polygonTemplate.propertyFields.fill = "fill";
}


function append_city(city, name, selector) {
    a_city = city.cloneNode(true);
    a_city.name = name;

    if (!document.querySelector(selector).childNodes.length) {

        document.querySelector(selector).appendChild(a_city);
    }
}

function remove_last() {
    let countries = sessionStorage.getItem("countries").split(', ');
    if (countries[countries.length - 1] === '') {
        countries.pop();
        countries.pop();
        countries.pop();
    } else {
        countries.pop();
        countries.pop();
    }
    countries = countries.join(', ')
    sessionStorage.setItem("countries", countries);
}