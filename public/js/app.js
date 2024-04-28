import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = document.querySelector('#lat').value || 27.49477;
const lng = document.querySelector('#lng').value || -109.89998;
const map = L.map('mapa').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //buscar la direccion
    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', buscarDireccion);
    
});


function buscarDireccion (e) {
    if(e.target.value.length > 8) {

        // si existe un pin anterior limpiarlo
        markers.clearLayers();


        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value })
            .then((result) => {
                console.log(result);
                if(result.length > 0) {
                    const { x, y } = result[0];
                    map.setView([y, x], 15);
                

                //agregar el pin
                marker = new L.marker([y, x], {
                    draggable: true,
                    autoPan: true
                })
                .addTo(map)
                .bindPopup(result[0].label)
                .openPopup();

                //asignar al contenedor de markers
                markers.addLayer(marker);

                //
                              
                }

            })
    }
}



