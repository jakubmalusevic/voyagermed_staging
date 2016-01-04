$(document).ready(function() {
    // Define the base URL
    var base_url = $('#base_url').text();
    var city = $('#city').text();
    var state = $('#state').text();

    $('#load_box').load(base_url +'clinics/backend', '', function() {
    	
    });
});