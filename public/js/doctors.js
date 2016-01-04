// Ensure dependencies are ready
$script.ready('global', function() {    
    $(function() {
        var base_url = $('#base_url').text();
        var letter = $('ul#letter_list li a.active').text();
        // console.log(base_url +'doctors/Browse');
       
        $('#doc_search_name_btn').on('click', function(e){
            var doc_search_txt = $('#doc_search_name').val();   
            $('.ajax-loader').show();
            $('#load_box').html("");
            $('#load_box').load(base_url +'doctors/browsebyname', 'name='+ doc_search_txt, function() {
                $('.ajax-loader').hide();
            });
        });
        
        $('#doc_search_name').keyup(function(e) {
            var val = $(this).val().trim();
            console.log(val);

            if(e.which == 27 || val == '') {
                $('#doc_autocomplete_name').slideUp('fast');
            } else {
                $('#doc_autocomplete_name').slideDown('fast');
                var data = 'q=' + val;                
                $('#doc_autocomplete_name').load(base_url + 'search/searchdoctors', data, function() {
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
        
        $('.browse_letter_link').on('click', function(e){
            e.preventDefault();
            $('.browse_letter_link').removeClass('active');
            $(this).addClass('active');
            var letter = $(this).data("letter");             
            $('.ajax-loader').show();
            $('#load_box').html("");
            $('#load_box').load(base_url +'doctors/browse', 'letter='+ letter, function() {
                $('.ajax-loader').hide();        
            });
        });

        if(letter != '') {
            $('#load_box').load(base_url +'doctors/browse', 'letter='+ letter, function() {
                $('.ajax-loader').hide();        
            });
        } else {
            // Define the base URL
            var first_name = $('#first_name').text();
            var last_name = $('#last_name').text();
            var doctor_id = $('#doctor_id').text();
            var state = $('#state').text();
            var abbrev = $('#abbrev').text();
            var city = $('#city').text();
            var angle = $('#angle').text();
            var inconsistent = $('#inconsistent').text();
            var pitch = parseInt($('#tilt').text());
            var name = $('.doc-title h1').text();
            var address = $('#address').text();
            var lat = $('#lat').text();
            var lon = $('#lon').text();

            if(pitch == 0 || isNaN(pitch)) {
                var pitch = 0;
            }

            function ScrollTo(id) {
                var tag = $('#' + id), headerOffset = $('#page-header').outerHeight();
                $('html,body').animate({
                    scrollTop: tag.offset().top - 100 - headerOffset
                }, 250);
            }

            $('.detail-link').on('click', function(e) {
                e.preventDefault();
                $('#collapse-bio').collapse('show');
                ScrollTo('doc-info-accordion');
            });
            
            // Make sure accordion scrolls to active element when changes occur
            $(document).on('hide.bs.collapse', '#doc-info-accordion', function(e) {
                ScrollTo('doc-info-accordion');
            });
            
            function Initialize(data, lat, lon, map_lat, map_lon) {
                var styles = [{
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": [{"visibility": "off"}]
                }, {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#aadd55"}]
                }, {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [{"visibility": "on"}]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                }, {
                    "featureType": "road.local",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                }, {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#0099dd"}]}];

                // Set the position of the doctor's office
                var latlng = new google.maps.LatLng(map_lat, map_lon);
                var options = {
                    scrollwheel: false,
                    mapTypeControlOptions: {
                        mapTypeIds: ['Styled']
                    },
                    mapTypeId: 'Styled',
                    center: latlng,
                    zoom: 13,
                };

                // Style the map
                var map = new google.maps.Map(document.getElementById('google_maps'), options);
                var styledMapType = new google.maps.StyledMapType(styles, {name: 'Doctor ' + name + ' @ ' + address});
                map.mapTypes.set('Styled', styledMapType);

                var marker = new google.maps.Marker({
                    map: map,
                    position: latlng,
                    animation: google.maps.Animation.DROP,
                });

                // Set the street view
                var real = new google.maps.LatLng(lat, lon);
                
                var doPanorama = function(e, size) {
                    var panoramaOptions = {
                        position: real,
                        linksControl: false,
                        pov: {
                            heading: parseInt(angle),
                            pitch: parseInt(pitch),
                            zoom: (['xxs', 'xs'].indexOf(size) !== -1 ? 1 : -1)
                        }
                    };

                    // Create panorama
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
                    map.setStreetView(panorama);
                    $(document).off('mqMatch.doPanorama');
                };

                // If mqCurrent is already set, init now
                if($(document).data('mqCurrent')) {
                    doPanorama(null, $(document).data('mqCurrent'));
                }

                // Listen for mqMatch once, since google does it's own responsive stuff
                $(document).on('mqMatch.doPanorama', doPanorama);

                // Plot all of the hotels
                var json = $.parseJSON(data);
                // console.log(json);

                $.each(json, function(idx, obj) {
                    var hotel_id = obj.hotel_id;
                    var lon = obj.lon;
                    var lat = obj.lat;
                    var title = obj.name;
                    var about = obj.description;
                    var pic = obj.pic;

                    var infowindow = new google.maps.InfoWindow({
                        content: ''
                    });

                    var pos = new google.maps.LatLng(lat, lon);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: pos,
                        title: title,
                    });

                    // OnClick Infomap
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.close();
                        var contentString = '<div style="font-weight: bold; font-size: 24px;">' + title + '</div>' +
                                            '<div>' + about + '</div>' +
                                            '<img src="http://images.travelnow.com/' + pic + '"  width="80" class="pull-left" style="margin-top: 5px; border: none;">' +
                                            '<button type="button" class="btn btn-primary pull-right trigger" name="' + hotel_id + '">Book a room</button>' +
                                            '<div class="clearfix"></div>';
                        infowindow.setContent(contentString);
                        infowindow.open(map, marker);

                        $('button.trigger').click(function() {
                            var hotel = $(this).attr('name');
                            window.location = 'http://www.travelnow.com/templates/478586/%20hotels/' + hotel + '/overview';
                        });

                        map.setZoom(15);
                        map.setCenter(marker.getPosition());
                    });
                });
            }

            // Load the specialties
            $('#specialty_load').load(base_url + 'doctors/getinfo', 'type=Procedures&id=' + doctor_id + '&unit=usd', function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            // Change the currencies
            $('select#currency_select').change(function(e) {
                $('#specialty_load').load(base_url + 'doctors/getinfo', 'type=Procedures&id=' + doctor_id + '&unit=' + $(this).val());
            });

            // Load all of the results
            $('#similar_load').load(base_url + 'doctors/getsimilardoctors', 'doctor_id=' + doctor_id, function() {
                $('.ajax-loader').fadeOut();
            });

            // Validate the contact form
            $('#contact_doc, #doc-title-btn').click(function(e) {
                var subject = "Your inquiry with "+ first_name +" "+ last_name;
                var comment = 'test';

                // Show the modal
                $('#modal').modal('show');

                $('form').submit(function(e) {
                    e.preventDefault();
                    var first = $('input[name=first_name]').val();
                    var last = $('input[name=last_name]').val();
                    var zip = $('input[name=zip]').val();
                    var email = $('input[name=email]').val();
                    var phone = $('input[name=phone]').val();
                    var interest = $('select[name=procedure]').val();
                    var comment = $('textarea[name=comment]').val();
                    // console.log(name +' '+ email);

                    var params = [$('input[name=first_name]'),
                                $('input[name=last_name]'),
                                $('input[name=zip]'),
                                $('input[name=email]'),
                                $('input[name=phone]'),
                                $('select[name=procedure]'),
                                $('textarea[name=comment]')];

                    for(var i = 0; i < params.length; i++) {
                        var val = params[i].val();
                        
                        if(val == '') {
                            params[i].css('border', 'solid 1px red');
                        } else {
                            params[i].css('border', 'solid 1px #ddd');
                        }
                    }

                    if(first != '' && last != '' && zip != '' && email != '' && phone != '' && email != '' && interest != '' && comment != '') {
                        $.ajax({
                            url: base_url + 'procedures/book',
                            data: {
                                first: first,
                                last: last,
                                zip: zip,
                                email: email,
                                phone: phone,
                                procedure: interest,
                                comment: comment
                            },
                            success: function(data) {
                                $('#modal').modal('hide');
                                console.log(data);
                            }
                        });
                    }
                });
            });
            
            // Validate the book appointment form
            $('#book_appointment').click(function(e) {
                var subject = "Your inquiry with "+ first_name +" "+ last_name;
                var comment = 'test';

                // Show the modal
                $('#modal1').modal('show');

                $('#appointment_form').submit(function(e) {
                    e.preventDefault();
                    var first = $('input[name=book_first_name]').val();
                    var last = $('input[name=book_last_name]').val();
                    var zip = $('input[name=book_zip]').val();
                    var email = $('input[name=book_email]').val();
                    var phone = $('input[name=book_phone]').val();
                    var time = $('input[name=book_datetime]').val();
                    var comment = $('textarea[name=book_comment]').val();
                    // console.log(name +' '+ email);

                    var params = [
                        $('input[name=book_first_name]'),
                        $('input[name=book_last_name]'),
                        $('input[name=book_zip]'),
                        $('input[name=book_email]'),
                        $('input[name=book_phone]'),
                        $('input[name=book_datetime]'),
                        $('input[name=book_comment]')
                    ];

                    for(var i = 0; i < params.length; i++) {
                        var val = params[i].val();
                        
                        if(val == '') {
                            params[i].css('border', 'solid 1px red');
                        } else {
                            params[i].css('border', 'solid 1px #ddd');
                        }
                    }

                    if(first != '' && last != '' && zip != '' && email != '' && phone != '' && email != '' && time != '' && comment != '') {
                        $.ajax({
                            url: base_url + 'procedures/bookappointment',
                            data: {
                                first: first,
                                last: last,
                                zip: zip,
                                email: email,
                                phone: phone,
                                time : time,                                
                                comment: comment
                            },
                            success: function(data) {
                                $('#modal1').modal('hide');
                                console.log(data);
                            }
                        });
                    }
                });
            });
            
            // Determine what lon & lat coordinates to use
            if(inconsistent == 'false') {
                var map_lat = $('#map_lat').text();
                var map_lon = $('#map_lon').text();
            } else {
                var map_lat = lat;
                var map_lon = lon;
            }

            // Get the results from the hotels in the given city
            $.ajax({
                url: base_url +'search/searchhotels',
                data: {
                    lat: map_lat,
                    lon: map_lon
                },
                success: function(data) {
                    //console.log(data);
                    Initialize(data, lat, lon, map_lat, map_lon);
                }
            });

            // Make doctor title stay put
            var docTitle = $('#doc-title'),
                topWrapper = $('#top_wrapper'),
                docTitleAffix = function (e, size) {
                    var headerOffset = $('#page-header').outerHeight(),
                        top = topWrapper.offset().top - headerOffset - parseFloat(docTitle.css('margin-top'));

                    if(!docTitle.data('bs.affix')) {
                        docTitle.affix({
                            offset: {
                                top: top
                            }
                        });
                    } else {
                        docTitle.data('bs.affix').options.offset.top = top;
                    }
                };

            // If mqCurrent is already set, init now
            if($(document).data('mqCurrent')) {
                docTitleAffix(null, $(document).data('mqCurrent'));
            }

            // Listen for mq changes and reinit
            $(document).on('mqMatch', docTitleAffix);

            // If present, init doctor highlights
            if($('#doctor-highlights').length > 0) {
                (function(){
                    // Cache selectors
                    var highlights = $('#doctor-highlights'),
                        highlightList = $('#highlight-list'),
                        items = highlightList.find('.item'),
                        iso;

                    // Helper to set each item's height so css animations work properly. Refreshed whenever layout changes.
                    var fixHeights = function() {
                        items.each(function() {
                            // Calculate displayed height manually, based on width
                            var a = $(this).children('a'), img = a.children('img'),
                                a_w = a.width(), img_w = img[0].naturalWidth,
                                img_h = img[0].naturalHeight;
                            a.height(Math.floor(img_h * (a_w/img_w)));
                        });

                        setTimeout(function(){iso.layout();});
                    };

                    // Add gallery to document body
                    var gallery = $('<div id="doctor-highlights-gallery" class="blueimp-gallery blueimp-gallery-controls"><div class="slides"></div><h3 class="title"></h3><a class="prev"><i class="fa fa-angle-left"></i><span class="sr-only">Prev</span></a><a class="next"><i class="fa fa-angle-right"></i><span class="sr-only">Next</span></a><a class="close"><i class="fa fa-times"></i><span class="sr-only">Close</span></a><a class="play-pause"></a><ol class="indicator"></ol></div>').appendTo(document.body);
                    
                    gallery.data({
                        closeOnSwipeUpOrDown: false,
                        disableScroll: false
                    });

                    gallery.on('slidecomplete',function (event, index, slide) {
                        var $slide = $(slide),//.removeClass('slide-loading'),
                            item = items.eq(index),
                            content = item.children('.gallery-content').clone();
                        content.find('.gallery-img').html('<img src="'+item.children('a[data-gallery]')[0].href+'" class="img-responsive" title="'+content.find('.gallery-title').text()+'" />');
                        $slide.html(content);
                    });

                    // Create isotope layout once images are loaded
                    highlightList.imagesLoaded(function() {
                        // Create isotope
                        highlightList.isotope({
                            itemSelector: '.item',
                            layoutMode: 'packery',
                            packery: {
                                columnWidth: '.grid-sizer',
                                gutter: 10
                            }
                        });
                        iso = highlightList.data('isotope');
                        highlights.removeClass('loading');

                        // Bind listener to fix heights, and run once now
                        iso.on('layoutComplete', fixHeights);
                        fixHeights();
                        $('#masonry_container').fadeOut();
                    });
                }) ();
            }
            
            //$('#datetimepicker1').datetimepicker();
        }
    });
});
