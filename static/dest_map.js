document.addEventListener('DOMContentLoaded', () => {
    let countries_raw = sessionStorage.getItem("countries").split(", ");
    countries_raw.pop();
    let countries = countries_raw.map((e, i) => [i, e]);

    let origins = countries.filter(elem => elem[0] % 2 === 0);
    let destinations = countries.filter(elem => elem[0] % 2 === 1);

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
    let id = country.map(elem => elem[1].split(" ")[elem[1].split(" ").length - 1]);
    let name = country.map(elem =>
        elem[1].split(" ").splice(0, elem[1].split(" ").length - 1));
    return [id, name];
}