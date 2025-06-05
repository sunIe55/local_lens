
const defaultCoords = [52.115, 21.016]; // Fallback to Piaseczno/Warsaw
const zoomLevel = 13;
const newsApiKey = '750520aa22fe4c46bbede051400a2d39'; // 🔑 Replace with your real NewsAPI key
const smallIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -30]
});

const map = L.map("map").setView(defaultCoords, zoomLevel);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// ✅ Get user location immediately
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      map.setView([lat, lng], zoomLevel);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();

      fetchNewsAndPlaceMarkers(lat, lng);
    },
    (err) => {
      console.warn("Geolocation error:", err.message);
      fetchNewsAndPlaceMarkers(defaultCoords[0], defaultCoords[1]);
    }
  );
} else {
  fetchNewsAndPlaceMarkers(defaultCoords[0], defaultCoords[1]);
}

// ✅ Fetch and place news article markers
function fetchNewsAndPlaceMarkers(lat, lng) {
  const radius = 0.15;
  const query = 'Warsaw OR Poland';

  fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=15&sortBy=publishedAt&apiKey=${newsApiKey}`)
    .then(res => res.json())
    .then(data => {
      if (!data.articles || data.articles.length === 0) {
        console.log("No news articles found.");
        return;
      }

      data.articles.forEach((article) => {
        const randomLat = lat + (Math.random() - 0.5) * radius;
        const randomLng = lng + (Math.random() - 0.5) * radius;

        const title = article.title || "Untitled";
        const description = article.description || "No description.";
        const url = article.url || "#";

        L.marker([randomLat, randomLng], { icon: smallIcon })
          .addTo(map)
          .bindPopup(`<strong>${title}</strong><br>${description}<br><a href="${url}" target="_blank">Read more</a>`);
      });
    })
    .catch(err => console.error("News fetch failed:", err));
}

// ✅ Refresh every 5 minutes
setInterval(() => {
  map.eachLayer(layer => {
    // Keep tile layers and "You are here" marker (which has popup)
    if (layer instanceof L.Marker && !layer.getPopup()) {
      map.removeLayer(layer);
    }
  });

  const center = map.getCenter();
  fetchNewsAndPlaceMarkers(center.lat, center.lng);
}, 300000); // 5 minutes

document.addEventListener("DOMContentLoaded", () => {
  const defaultCoords = [37.7749, -122.4194]; // Fallback to SF
  const zoomLevel = 13;
  const newsApiKey = '750520aa22fe4c46bbede051400a2d39'; // 🔑 Replace with your NewsAPI key

  const smallIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [20, 30],
    iconAnchor: [10, 30],
    popupAnchor: [0, -30]
  });

  const map = L.map("map").setView(defaultCoords, zoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Attempt to get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], zoomLevel);
        L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();

        fetchNewsAndPlaceMarkers(lat, lng);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        fetchNewsAndPlaceMarkers(defaultCoords[0], defaultCoords[1]);
      }
    );
  } else {
    fetchNewsAndPlaceMarkers(defaultCoords[0], defaultCoords[1]);
  }

  // Fetch and place news articles on the map
  function fetchNewsAndPlaceMarkers(lat, lng) {
    const radius = 0.1;

    fetch(`https://newsapi.org/v2/everything?q=city OR local OR breaking&language=en&pageSize=20&sortBy=publishedAt&apiKey=${newsApiKey}`)
      .then(res => res.json())
      .then(data => {
        if (!data.articles) {
          console.error("No articles found or API limit hit.");
          return;
        }

        data.articles.forEach((article, i) => {
          const randomLat = lat + (Math.random() - 0.5) * radius;
          const randomLng = lng + (Math.random() - 0.5) * radius;

          const title = article.title || "Untitled";
          const description = article.description || "No description.";
          const url = article.url || "#";

          L.marker([randomLat, randomLng], { icon: smallIcon })
            .addTo(map)
            .bindPopup(`<strong>${title}</strong><br>${description}<br><a href="${url}" target="_blank">Read more</a>`);
        });
      })
      .catch(err => console.error("Failed to fetch news:", err));
  }
  setInterval(() => {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker && !layer._popup) {
      map.removeLayer(layer); // Keep "You are here" marker
    }
  });
  fetchNewsAndPlaceMarkers(map.getCenter().lat, map.getCenter().lng);
}, 300000); // every 5 minutes

});

