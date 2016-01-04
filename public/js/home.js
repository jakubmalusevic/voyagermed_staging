// Ensure dependencies are ready
$script.ready('jQuery', function() {

    // Document.ready
    $(function() {
        var base_url = $('#base_url').text();
        var city = $('#city').text();
        var state = $('#state').text();

        $('#main-search-form').submit(function(e) {
            e.preventDefault();

            // Get the values from the two input fields
            var pro = $('#search_input').val();  
            var loc = $('#location').val().replace(',', '');
            if (loc == '') {
                loc = 'all';
            }
            window.location.href = base_url +'search/'+ pro.replace(' ', '-') +'/'+ loc.replace(' ', '-') +'/distance-desc';         
        });

        // Show relevant locations upon keyup
        $('#location').keyup(function(e) {
            var val = $(this).val();
            // console.log(val);

            if(e.which == 27 || val == '') {
                $('#autocomplete_locations').slideUp('fast');
            } else {
                $('#autocomplete_locations').slideDown('fast');
                var data = 'q='+ val;

                $('#autocomplete_locations').load(base_url +'home/backendlocations', data, function() {
                    $('.list-group li').click(function() {
                        var sec_val = $(this).attr('name');
                        var new_val = $(this).text().trim();
                        $('#location').val(new_val);
                        $('#location_text').text(sec_val);
                        $('#autocomplete_locations').slideUp();
                    });
                });
            }
        });

        $('#location').click(function(e) {
            $('#autocomplete').slideUp('fast');
        });

        $('#search_input').click(function(e) {
            $('#autocomplete_locations').slideUp('fast');
        });

        // Show relevant search results upon keyup of input field
        $('#search_input').keyup(function(e) {
            var val = $(this).val();
            // console.log(val);

            if(e.which == 27 || val == '') {
                $('#autocomplete').slideUp('fast');
            } else {
                $('#autocomplete').slideDown('fast');
                var data = 'q='+ val;

                $('#autocomplete').load(base_url +'procedures/backend', data, function() {
                    $('.list-group li').click(function() {
                        var sec_val = $(this).attr('name');
                        var new_val = $(this).text().trim();
                        $('#search_input').val(new_val);
                        $('#procedure_text').text(sec_val);
                        $('#autocomplete').slideUp();
                    });
                });
            }
        });
        
        // Validate the book appointment form
        $('#compare_contact').click(function(e) {
            event.preventDefault();
            // Show the modal
            $('#modal1').modal('show');

            $('#contact_form').submit(function(e) {
                e.preventDefault();
                var first = $('input[name=conntact_first_name]').val();
                var last = $('input[name=conntact_last_name]').val();                
                var email = $('input[name=conntact_email]').val();
                var comment = $('textarea[name=conntact_comment]').val();
                // console.log(name +' '+ email);

                var params = [
                    $('input[name=conntact_first_name]'),
                    $('input[name=conntact_last_name]'),                    
                    $('input[name=conntact_email]'),
                    $('input[name=conntact_comment]')
                ];

                for(var i = 0; i < params.length; i++) {
                    var val = params[i].val();
                    
                    if(val == '') {
                        params[i].css('border', 'solid 1px red');
                    } else {
                        params[i].css('border', 'solid 1px #ddd');
                    }
                }

                if(first != '' && last != ''  && email != '' && comment != '') {
                    $.ajax({
                        url: base_url + 'procedures/comparecontact',
                        data: {
                            first: first,
                            last: last,
                            email: email,
                            comment: comment
                        },
                        success: function(data) {
                            $('#modal1').modal('hide');
                            //console.log(data);
                        }
                    });
                }
                return false;
            });
        });
            
    });
});