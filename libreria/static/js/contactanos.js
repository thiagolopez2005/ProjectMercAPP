
<script src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.1806433432193!2d-74.08771672477175!3d4.738654595236517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f84fb1880512b%3A0x4967c7a630a77287!2sCentro%20Comercial%20Subazar!5e0!3m2!1ses-419!2sco!4v1720229067390!5m2!1ses-419!2sco" async defer></script>

    function initMap() {
        var geocoder = new google.maps.Geocoder();
        var address = 'calle 9bis a2-03 sogamoso';

        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                var map = new google.maps.Map(document.getElementById('mapa'), {
                    zoom: 15,
                    center: results[0].geometry.location
                });
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                });
            } else {
                alert('Geocode no tuvo éxito debido a: ' + status);
            }
        });
    }