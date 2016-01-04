// Ensure dependencies are ready
$script.ready('jQuery',function() {

    // Document.ready
    $(function() {
        var base_url = $('#base_url').text();

        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        // Submit the signup form
        $('#login_form').submit(function(e) {
            e.preventDefault();
            var email = $('#login_form #signin_email').val();
            var pass = $('#login_form #signin_pass').val();

            if(pass != '' && validateEmail(email)) {
                $('#login_form #signin_email').css('border', 'solid 1px #ddd');
                $('#login_form #signin_pass').css('border', 'solid 1px #ddd');

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
                            $('#login_form #signin_email').css('border', 'solid 1px red');
                            $('#login_form #signin_pass').css('border', 'solid 1px red');
                        }
                    }
                });
            } else {
                $('#login_form #signin_email').css('border', 'solid 1px red');
                $('#login_form #signin_pass').css('border', 'solid 1px red');
            }
        });
    });
});