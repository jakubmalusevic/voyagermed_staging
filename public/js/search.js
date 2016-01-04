// Ensure dependencies are ready
$script.ready(['jQuery', 'Bootstrap'],function() {

    // Document.ready
    $(function() {
        /*
        var $sidebar   = $('#fixed_bar'), 
            $window    = $(window),
            offset     = $sidebar.offset(),
            topPadding = 15;

        $window.scroll(function() {
            if($window.scrollTop() > offset.top) {
                $sidebar.stop().animate({
                    marginTop: $window.scrollTop() - offset.top + topPadding
                });
            } else {
                $sidebar.stop().animate({
                    marginTop: 20
                });
            }
        });
        */ 
       
        var base_url = $('#base_url').text();
        // var slider = $("input.slider").slider();

        // Get the value of the option that is currently selected
        var procedure = $('#search_input').val();
        var location = $('#location').val();
        var sort = $('#sort_by').val();
        // console.log(checked);
        
        // Define the query string
        var string = 'type='+ sort +'&procedure='+ procedure +'&location='+ location +'&edu=&page=0&hosp=';
        $('#load_box').load(base_url +'search/backend', string, function() {
            $('.ajax-loader').fadeOut();
            $("[data-toggle='tooltip']").tooltip();

            /*
            $('.price').click(function() {
                $('#signin_modal').modal('show');
            });
            */
        });

        $('#search-form').submit(function(e) {
            e.preventDefault();

            // Get the values from the two input fields
            var pro = $('#search_input').val();  
            var loc = $('#location').val().replace(',', '');
            if (loc == '') {
                loc = 'all';
            }
            var url = base_url +'search/'+ pro.replace(' ', '-') +'/'+ loc.replace(' ', '-') +'/distance-desc';         
            window.location = url;
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

        $('input[name=schools], input[name=hospitals], #ex1').click(function() {
            var edu = [];
            var all = $('input[name=schools]');
            $.each(all, function(index, item) {
                // console.log($(item).attr('name'));

                if($(item).is(':checked')) {
                    edu.push($(item).val());
                }
            });

            var hosp = [];
            var all = $('input[name=hospitals]');
            $.each(all, function(index, item) {
                // console.log($(item).attr('name'));

                if($(item).is(':checked')) {
                    hosp.push($(item).val());
                }
            });

            var edu_str = edu.join(', ');
            var hosp_str = hosp.join(', ');

            var val = $('#sort_by').val();
            var procedure = $('#search_input').val();
            var location = $('#location').val();
            var price = '';
            // var price = $('#ex1').val();
            console.log(price);

            // If the user hasn't selected any states, then set the 'all' variable to 'everywhere'
            if(location == '' || location == ',') {
                var location = 'all';
            }

            // If search-reveal is open, hide it
            if($('#search-reveal').hasClass('in')) {
                $('#search-reveal').offcanvas('hide');
            }

            $('#search-reveal').offcanvas('hide');

            $('#load_box').html('<div class="ajax-loader"><i class="fa fa-circle-o-notch fa-3x fa-spin"></i></div>');
            var string = 'type='+ val +'&procedure='+ procedure +'&location='+ location + '&page=0&edu='+ edu_str +'&hosp='+ hosp_str;
            // console.log(string);

            $('#load_box').load(base_url +'search/backend', encodeURI(string), function() {
                $('.ajax-loader').fadeOut();
                $('body').css('overflow', 'visible');
            });
        });

        // Sort the results
        $('#sort_by').change(function() {
            var val = $(this).val();
            var procedure = $('#search_input').val();
            var location = $('#location').val();

            // If the user hasn't selected any states, then set the 'all' variable to 'everywhere'
            if(location == '' || location == ',') {
                var location = 'all';
            }

            var string = 'type='+ val +'&procedure='+ procedure +'&location='+ location +'&page=0&edu=&hosp=';
            $('#load_box').load(base_url +'search/backend', string, function() {
                $('.ajax-loader').fadeOut();
            });
        });

        // Redirect the page to the correct place upon submitting the form
        $('#search_procedures').submit(function(e) {
            e.preventDefault();
            var procedure_text = $('#procedure_text').text();
            var location_text = $('#location_text').text();
            
            var procedure_input = $('#search_input').val();
            var location_input = $('#location').val();
            
            var location = 'all';
            var procedure = 'all';
                       
            if(procedure_input != '') {
                procedure = procedure_text;
            }
            if(location_input != '') {
                location = location_text;
            }

            window.location = base_url +'search/'+ procedure +'/'+ location +'/distance-desc';
        });
    });
});

// Ensure dependencies are ready
$script.ready('global', function() {
    var htmlEl = document.getElementsByTagName("html")[0];
    // Handle search form in sidebar/reveal
    var srchFormCont = $('#fixed_bar'),
        srchFormShim = $('#fixed_bar_shim'),
        srchFormReveal = $('#search-reveal'),
        srchFormSetup = function(e,size) {

            // If mobile, move search form to reveal sidebar
            if(['xxs','xs'].indexOf(size) !== -1 && srchFormShim.has(srchFormCont).length) {
                srchFormShim.hide();
                srchFormCont.appendTo(srchFormReveal);
            }
            // If not, move search form to form container
            else if(['xxs','xs'].indexOf(size) === -1 && srchFormReveal.has(srchFormCont).length) {
                srchFormCont.appendTo(srchFormShim);
                srchFormShim.show();
                // If reveal is currently visible, toggle it back off
                if(srchFormReveal.hasClass('in')) $('#search-reveal-toggle').trigger('click');
            }

            // Ensure that search box is unhidden on first run
            srchFormCont.removeClass('hidden-xs');

            // On mobile devices, make sure that html element is not scrollable while form is open
            srchFormReveal.off('.offcanvas').on('show.bs.offcanvas',function(){
                $(htmlEl).addClass('offcanvas-active');
            }).on('hidden.bs.offcanvas',function(){
                $(htmlEl).removeClass('offcanvas-active');
            });
        };

    // If mqCurrent is already set, init now
    if($(document).data('mqCurrent')) { srchFormSetup(null,$(document).data('mqCurrent')); }
    
    // Listen for mq changes and reinit
    $(document).on('mqMatch',srchFormSetup);

    // Modals must be moved outside of search-results-canvas because of
    // search form sidebar reveal's affect on zindex values
    $('#search-results-canvas').find('.modal').appendTo(document.body);
});