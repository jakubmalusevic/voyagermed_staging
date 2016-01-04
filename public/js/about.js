// Ensure dependencies are ready
$script.ready('jQuery', function() {
    function ScrollTo(id) {
        var tag = $('#' + id), headerOffset = $('#page-header').outerHeight();
        $('html,body').animate({
            scrollTop: tag.offset().top - 100 - headerOffset
        }, 250);
    }

    $('.down-arrow-scroll').on('click', function(e) {
        e.preventDefault();
        ScrollTo('about_columns');
    });
});