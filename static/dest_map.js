document.addEventListener('DOMContentLoaded', () => {
    let countries = sessionStorage.getItem("countries").split(", ");
    countries.pop();

    let origins = countries.filter(elem => countries.indexOf(elem) % 2 === 0);
    let destinations = countries.filter(elem => countries.indexOf(elem) % 2 === 1);

    let [origin_ids, origin_names] = get_id_name(origins);
    let [dest_ids, dest_names] = get_id_name(destinations);

    let selected_countries = [];
    for (let i = 0; i < origin_names.length; i++) {
        selected_countries.push({
            "id": origin_ids[i],
            "name": origin_names[i],
            "value": i,
            "fill": am4core.color("#F05C5C")
        }, {
            "id": dest_ids[i],
            "name": dest_names[i],
            "value": i + 100,
            "fill": am4core.color("#F05C5C")
        });
    }

    polygonSeries.data = selected_countries;
    polygonTemplate.propertyFields.fill = "fill";
});

function get_id_name(country) {
    let id = country.map(elem => elem.split(" ")[elem.split(" ").length - 1]);
    let name = country.map(elem =>
        elem.split(" ").splice(0, elem.split(" ").length - 1));
    return [id, name];
}