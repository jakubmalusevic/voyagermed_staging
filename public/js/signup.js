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
        $('#signup_form').submit(function(e) {
            e.preventDefault();
            var email = $('#signup_form #signin_email').val();
            var pass = $('#signup_form #signin_pass').val();
            var confirm = $('#signup_form #signin_confirm').val();
            // console.log(validateEmail(email));
            // console.log(email);

            if(pass.length > 6 && confirm == pass && validateEmail(email)) {
                $('#signup_valid').slideUp();
                $('#signup_pass').slideUp();
                $('#signup_invalid_combo').slideUp();
                $('#signup_confirm').slideUp();

                $.ajax({
                    url: base_url + 'users/signup',
                    type: 'POST',
                    data: {
                        email: email,
                        pass: pass,
                        confirm: confirm
                    },
                    success: function(data) {
                        console.log(data);
                        if(data == 'success') {
                            window.location.href = base_url;
                        } else {
                            $('#signup_invalid_combo').slideDown();
                        }
                    }
                });
            } else {
                if(pass.length < 6) {
                    $('#signup_pass').slideDown();
                } else {
                    $('#signup_pass').slideUp();

                    if(pass != confirm) {
                        $('#signup_confirm').slideDown();
                    } else {
                        $('#signup_confirm').slideUp();
                    }
                }

                if(validateEmail(email) === false) {
                    $('#signup_valid').slideDown(); 
                } else {
                    $('#signup_valid').slideUp();   
                }
            }
        });
    });
});