$script.ready('global', function() {
    // Document.ready
    $(function() {
		var base_url = $('#base_url').text();
		var doctor_id = $('#doc_id').val();

		$('.admin_load').each(function() {
			var id = $(this).attr('id');
			var str = 'id='+ doctor_id +'&type='+ id;

			$(this).load(base_url +'admin/getadminstats', str, function() {
	            $('.ajax-loader').fadeOut();

	            $('.fa-remove').click(function() {
	            	var div = $(this).closest('div.admin_load');
	            	var new_id = div.attr('id');
	            	var name = $(this).prev();
	            	console.log(name);
	            });
	        });
		});

		function validateEmail($email) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailReg.test($email);
        }

		// Submit the admin form
        $('#admin_form').submit(function(e) {
            e.preventDefault();
            var email = $('#admin_form input[name="email"]').val();
            var pass = $('#admin_form input[name="password"]').val();

            if(pass != '' && validateEmail(email)) {
                $('#admin_form input[name="email"]').css('border', 'solid 1px #ddd');
                $('#admin_form input[name="password"]').css('border', 'solid 1px #ddd');

                $.ajax({
                    url: base_url + 'admin/signin',
                    type: 'POST',
                    data: {
                        email: email,
                        password: pass
                    },
                    success: function(data) {
                        console.log(data);
                        if(data == 'success') {
                            window.location.href = base_url +'admin?id=2';
                        } else {
                            $('#admin_form input[name="email"]').css('border', 'solid 1px red');
                            $('#admin_form input[name="password"]').css('border', 'solid 1px red');
                        }
                    }
                });
            } else {
                $('#admin_form input[name="email"]').css('border', 'solid 1px red');
                $('#admin_form input[name="password"]').css('border', 'solid 1px red');
            }
        });

		$('.fa-plus-circle').click(function() {
			var id = $(this).attr('id');
			var input = '<input type="text" class="form-control pull-left" name="'+ id +'[]" placeholder="Add a new '+ id +'" value="" onkeyup="">';
			var str = '<p>'+ input +'<span class="clearfix"></span></p>';
	    	$('div#'+ id +' .none').fadeOut();
	    	$('div#'+ id).append(str);
	    });
	});
});