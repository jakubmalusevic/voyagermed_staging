$script.ready('global', function() {
    // Document.ready
    $(function() {
		var base_url = $('#base_url').text();
		var letter = $('ul#letter_list li a.active').text();

		$('#load_box').load(base_url +'browse/backend', 'letter='+ letter, function() {
        
        });
	});
});