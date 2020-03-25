
var lat = 37.524959
var lng = 126.925991
var range = 1000
var latlng = L.latLng(lat, lng)

var map = L.map("mapid").setView(latlng, 16);

// POI Layer
var layer_green = L.layerGroup().addTo(map)
var layer_yellow = L.layerGroup().addTo(map)
var layer_red = L.layerGroup().addTo(map)
var layer_gray = L.layerGroup().addTo(map)
var marker_layers = [layer_green, layer_yellow, layer_red, layer_gray]

// Custom Icons
var icon_green = L.AwesomeMarkers.icon({ markerColor: 'green', icon: 'heart' });
var icon_yellow = L.AwesomeMarkers.icon({ markerColor: 'orange', icon: 'ok-sign' });
var icon_red = L.AwesomeMarkers.icon({ markerColor: 'red', icon: 'question-sign' });
var icon_gray = L.AwesomeMarkers.icon({ markerColor: 'gray', icon: 'remove-sign' });

const marker_icons = [icon_green, icon_yellow, icon_red, icon_gray]


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 100,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

// show layers controls
L.control.layers(
  {
    // No base map layer
  }, {
    "초록: 100개 이상": layer_green,
    "주황: 100개 미만": layer_yellow,
    "빨강: 30개 미만": layer_red,
    "검정: 재고 없음": layer_gray
  }, {
    collapsed: false
  }).addTo(map);

// show scales control
var scale = L.control.scale().addTo(map); 

// location popup 
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on('click', (e) => {
  scan(e.latlng)
});

// circle
function newRangeCircle(newLatLng, radius) {
  radius = radius || range
  return L.circle(newLatLng, {
    color: '#777',
    fillColor: '#333',
    fillOpacity: 0.2,
    radius: radius
  })
}
var circle = newRangeCircle(latlng);

$(window).on("resize", function () {
  $("#mapid").height($(window).height() - 2*60);
  map.invalidateSize();
}).trigger("resize");

// Detect moves
this.map.on("moveend", function(s){
  latlng = map.getCenter()
  console.log(`moved to ${latlng}`)
});

// Detect zoom
this.map.on("zoomend", function(s) {
  console.log('zoomend:'+map.getZoom())
})

// Layers
// Green (100개 이상)/Yello(30~99개)/Red(2~29개)/Gray(0~1개)


function home() {
  if (!USE_CURRENT_LOCATION) return

  navigator.geolocation.getCurrentPosition(function (location) {
    latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
    map.setView(latlng)

    // var map = L.map('mapid').setView(latlng, 13)
    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox.streets',
    //   accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
    // }).addTo(map);

    // var marker = L.marker(latlng).addTo(map);
  }, function(e) {
    if (GeolocationPositionError.PERMISSION_DENIED === e.code) {
      // 
      map.setView(latlng) // just current
    }

    // redirect to https in production
    if (document.location.hostname !== 'localhost' && document.location.protocol == 'http:') {
      document.location.href = document.location.href.replace('http:', 'https:');
    }
  })
}

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
// }).addTo(map);

//
const REMAIN_LAYER_MAPPER = {
  'plenty': 0,
  'some': 1,
  'few': 2,
  'empty': 3, 
}

function scan(area) {
  // latlng = map.getCenter()
  area = area || latlng
  console.log(`scan: lat:${area.lat}, lng:${area.lng}`)

  // draw circle
  circle.remove()
  circle = newRangeCircle(area).addTo(map)

  const baseURL = '/corona19-masks/v1'

  $.ajax({
    method: "GET",
    url: `${baseURL}/storesByGeo/json`,
    contentType: "application/json",
    data: {
      lat: area.lat,
      lng: area.lng,
      m: range // meter
    }
  }).done(function (data) {
    if (data) {
      // createPOI(data.stores)
      marker_layers.map(layer => {
        layer.clearLayers()
      })
      data.stores.map(store => {
        let sample = {
          addr: "경기도 안양시 동안구 귀인로 213 (평촌동, 현대5차상가 115호)",
          code: "31842453",
          created_at: "2020/03/12 20:30:00",
          lat: 37.3872472,
          lng: 126.9619406,
          name: "천일약국",
          remain_stat: "empty",
          stock_at: "2020/03/12 11:10:00",
          type: "01",
        }
        
        if (REMAIN_LAYER_MAPPER.hasOwnProperty(store.remain_stat)) {
          const idx = REMAIN_LAYER_MAPPER[store.remain_stat]
          let layer = marker_layers[idx]
          let icon = marker_icons[idx]

          return L.marker([store.lat, store.lng], {icon: icon})
            .bindPopup(`<b>${store.name}</b>`+`<li>In-Stock : <b>${store.stock_at}</b></li><li>Updated : ${store.created_at} </li><a href="https://map.kakao.com/?q=${store.addr}" target="blank">${store.addr}</a>`)
            .on('click', function() { 
              // alert('Clicked on a !'); 
            })
            .addTo(layer)
        }
      })

      // if (data._id)
      //   $('#response').html($.i18n('added_to_database', AntiXSS.sanitizeInput(data.name)));
      // else
      //   $('#response').html($.i18n('hello', AntiXSS.sanitizeInput(data.name)));
    }
    else {
      // $('#response').html(AntiXSS.sanitizeInput(data));
    }
  });
}