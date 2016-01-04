// Ensure dependencies are ready
$script.ready('jQuery', function() {

    // Document.ready
    $(function () {
        var base_url = $('#base_url').text();

        function validateEmail($email) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailReg.test($email);
        }

        // The signin form
        $('#signin_form').submit(function(e) {
            e.preventDefault();
            var email = $('#signin_email').val();
            var pass = $('#signin_pass').val();

            if(pass != '' && validateEmail(email)) {
                $('#valid').slideUp();
                $('#pass').slideUp();
                $('#invalid_combo').slideUp();

                $.ajax({
                    url: base_url + 'users/signin',
                    type: 'POST',
                    data: {
                        email: email,
                        pass: pass
                    },
                    success: function(data) {
                        console.log(data);
                        if(data == 'success') {
                          window.location.href = base_url;
                        } else {
                            $('#invalid_combo').slideDown();
                        }
                    }
                });
            } else {
                if(pass == '') {
                    $('#pass').slideDown();
                } else {
                    $('#pass').slideUp();
                }

                if(validateEmail(email) === false || email == '') {
                    $('#valid').slideDown();
                } else {
                    $('#valid').slideUp();   
                }
            }
        });

        // Change the language
        $('#change_lang').change(function(e) {
            $.ajax({
                url: base_url +'home/changelang',
                data: {
                    lang: $(this).val()
                },
                success: function(data) {
                    location.reload();
                }
            });
        });
       
        $('#doc_search').keyup(function(e) {
            var val = $(this).val().trim();
            console.log(val);

            if(e.which == 27 || val == '') {
                $('#doc_autocomplete').slideUp('fast');
            } else {
                $('#doc_autocomplete').slideDown('fast');
                var data = 'q=' + val;                
                $('#doc_autocomplete').load(base_url + 'search/searchdoctors', data, function() {
                    jQuery('img.svg').filter(function() {
                        return this.src.match(/\.svg/i) !== null;
                    }).each(function () {
                        var $img = jQuery(this);
                        var imgID = $img.attr('id');
                        var imgClass = $img.attr('class');
                        var imgURL = $img.attr('src');

                        jQuery.get(imgURL, function (data) {
                            // Get the SVG tag, ignore the rest
                            var $svg = jQuery(data).find('svg');

                            // Add replaced image's ID to the new SVG
                            if(typeof imgID !== 'undefined') {
                                $svg = $svg.attr('id', imgID);
                            }

                            // Add replaced image's classes to the new SVG
                            if(typeof imgClass !== 'undefined') {
                                $svg = $svg.attr('class', imgClass + ' replaced-svg');
                            }

                            // Remove any invalid XML tags as per http://validator.w3.org
                            $svg = $svg.removeAttr('xmlns:a');

                            // Replace image with new SVG
                            $img.replaceWith($svg);
                        }, 'xml');
                    });
                });
            }
        });       
        
        
    });
});

// Ensure dependencies are ready
$script.ready(['Bootstrap', 'matchMedia', 'ssm'],function() {
    $('[data-toggle="tooltip"]').tooltip();
    
    /*
    // Handle sub-footer columns/accordion
    var subFooter = $('#sub_footer'),
        accHeaders = subFooter.find('.list_header'),
        active = false,
        footerScrollTo = function(el) {
            var tag = $(el), headerOffset = $('#page-header').outerHeight();
            $('html,body').animate({
                scrollTop: tag.offset().top - 30 - headerOffset
            }, 250);
        },
        accSetup = function(e,size) {
            accHeaders.each(function(idx){
                var hdr = $(this),
                    cols = hdr.next('.list_columns');
                if(!cols[0].id) cols.attr('id','footer-collapse-'+ idx);
                cols.off('shown.bs.collapse').on('shown.bs.collapse',function() {
                    if(active) footerScrollTo(hdr[0]);
                });
            });

            subFooter.off('show.bs.collapse').on('show.bs.collapse', function() {
                if (active) subFooter.find('.in').collapse('hide');
            });

            // If mobile, collapse footer columns into accordion
            if(['xxs','xs'].indexOf(size) !== -1) {
                active = true;
                accHeaders.each(function() {
                    var hdr = $(this),
                        cols = hdr.next('.list_columns');
                    hdr.attr('data-toggle', 'collapse');
                    hdr.attr('data-target', '#'+cols[0].id);
                    cols.addClass('collapse').collapse('hide');
                });
            }
            // If not, expand all footer columns
            else if(['xxs','xs'].indexOf(size) === -1) {
                active = false;
                accHeaders.each(function() {
                    var hdr = $(this),
                        cols = hdr.next('.list_columns');
                    cols.removeClass('collapse in').collapse('show');
                    hdr.attr('data-toggle', '');
                    hdr.attr('data-target', '');
                });
            }
        };

        // If mqCurrent is already set, init now
        if($(document).data('mqCurrent')) { 
            accSetup(null,$(document).data('mqCurrent')); 
        }

        // Listen for mq changes and reinit
        $(document).on('mqMatch',accSetup);
        */
    });