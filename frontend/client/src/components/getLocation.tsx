export function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (err) => {
          resolve({
            lat: -1,
            lng: -1,
          })
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
      )
    } else {
      reject({ latitude: -1, longitude: -1 })
    }
  })
}
