// Ensure dependencies are ready
$script.ready('jQuery', function() {
    // Document.ready
    $(function() {
    	var base_url = $('#base_url').text();
    	var keyword = $('#keyword').text();
        var session = $('#session').text();

    	$('form[name=comment_form]').submit(function(e) {
            e.preventDefault();
            var comment = $('textarea[name=comment]').val();

            if(session == 'true') {
                if(comment != '') {
                	$('#comment_error').slideUp();
                	
                    $.ajax({
                        url: base_url +'community/comment',
                        type: 'POST',
                        data: {
                        	keyword: keyword,
                            comment: comment
                        },
                        success: function(data) {
                            $('textarea[name=comment]').val('');

                            // console.log(data);
                            var string = 'keyword='+ keyword;
    				    	$('#load_box').load(base_url +'community/getcomments', string, function() {
    				        	$('.ajax-loader').fadeOut();
    				    	});
                        }
                    });
                } else {
                	$('#comment_error').slideDown();
                }
            } else {
                $('#signin_modal').modal('show');
            }
        });

        var string = 'keyword='+ keyword;
    	$('#load_box').load(base_url +'community/getcomments', string, function() {
        	$('.ajax-loader').fadeOut();
    	});
    });
});