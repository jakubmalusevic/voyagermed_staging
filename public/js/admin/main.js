$(function(){
    
     $(document).ready(function () {
                  
    });
    
    
    $('.del').click(function(){
        var result = confirm("Delete?");
        if (!result) {
            return false;
        }
    });

    $('#summernote_procedure').summernote({
        height: 300,                 // set editor height

        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor

        focus: true,                 // set focus to editable area after initializing summernote
    });

    $('#summernote_doctor').summernote({
        height: 150,                 // set editor height

        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor

        focus: true,                 // set focus to editable area after initializing summernote
    });

    $('#summernote_masonry').summernote({
        height: 150,                 // set editor height

        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor

        focus: true,                 // set focus to editable area after initializing summernote
    });

    $(document).on('keydown', '.specialty-input', function() {
        $('.specialty-input').autocomplete({
                minLength: 1,
                maxRows: 5,
                source: function (req, add) {
                    $.ajax({
                        url: "/admin_dev/doctor/searchprocedures",
                        dataType: 'json',
                        type: 'POST',
                        data: req,
                        success: function (data) {
                            var procedures = [];
                            if (data.length != 0) {
                                $.each(data, function (key, value) {
                                    procedures.push(value.name);
                                });
                            } else {
                                procedures.push("No result");
                            }
                            add(procedures);

                        }
                    });
                },
                //change: function(event,ui){
                //    $(this).val((ui.item ? ui.item.id : ""));
                //}
            });
    });

    $(document).on('click', '.img', function() {
        console.log($(this).parent('input'));
        $(this).parent().find('input').click();
    });

});


function add_delete_input(this_element,name,action){
    var divId = '#'+name+'_block';
    var elementClass = '.'+name+'_element';
    var divElement = $('.'+name+'_element');

    var i = ($(divId + " " + elementClass).size() == 1 ? 1 : $(divId + " " + elementClass).size() + 1);
    var html = '<div class="form-group '+name+'_element new_'+name+'_element">' + $(elementClass).html() + "</div>";

    if(action == 'add')
    {
        $(html).appendTo(divId).find("img").remove();
        $(divId + " .new_"+name+"_element").last().find("input").removeAttr("value")
        i++;
    }
    else if(action == 'delete')
    {

        if( i >= 2 )
        {
            $(this_element).parents(elementClass).remove();
            i--;
        }
    }
}

function deleteInfo(element,name,id){
    if(element.parents(".new_"+name+"_element").html() !== undefined){
        $(element).parents(".new_"+name+"_element").remove();
    }else{
        var i = ($("."+name+"_element").size() == 1 ? 1 : element.parents().size() + 1);
        data = {
            'name':name,
            'id':id
        };
        $.ajax({
            url: "/admin_dev/doctor/deletedoctorinfo",
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                if( i >= 2 && data == '1' )
                {
                    $(element).parent().parent().parent().parent().remove();
                    i--;
                }
            }
        });
    }
}

$(document).ready(function() {
    var table = $('#specialty_table').DataTable({
        lengthMenu: [100]
    });
    
        
    $('#add_new_specialty_btn').on( 'click', function () {
        var rid = $('#new_specialty_dropdown').find(':selected').data('id'); 
        var name = $('#new_specialty_dropdown').val();
        var price = $('#new_specialty_price').val();
        if(name == "") return;
        
        table.row.add( [
            name+'<input type="hidden" name="specialty_id[]" value="">' + '<input type="hidden" name="specialty_name[]" value="' + name + '">' + '<input type="hidden" name="specialty_real_id[]" value="' + rid + '">',
            '<input type="text" class="form-control"  name="specialty_price[]" placeholder="0" value="' + price + '">',
            '<span class="delete-input specialty-delete-input" style="margin-top: 0;"><i class="fa fa-minus-circle"></i></span>'
        ] ).draw();         
    } );
    
    $('#specialty_table').on('click', '.specialty-delete-input', function () {
        var tr = $(this).parents('tr');
        var row = table.row(tr);
        var rowNode = row.node();
        row.remove();
        table.draw();
    });
    
    $('#is_street_image').on('click', function() {
        if($('#is_street_image').is(':checked') == true)
        {
            $('#street_view_image_div').show();
        }
        else
        {
            $('#street_view_image_div').hide();
        }
    });
    
    var doctors_param = $('#doctors_table').data('id');    
    var table1 = $('#doctors_table').DataTable();
    /*
    var table1 = $('#doctors_table').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "./doctorsSearch/" + doctors_param
    } );
    */
    
    var table2 = $('#procedures_table').DataTable();
    
    
    $('#doctor_image').click(function(){
        window.crop.click();
    });
    
    $('#update_doctor').click(function(){
        var fullPath = $('#doctor_image_src').attr('src');
        var filename = fullPath.replace(/^.*[\\\/]/, '');
        $('#doctor_image_name').val(filename);
        $('#doctor_create_form').submit();
    });
    
    
    //for ip blocking
    var table3 = $('#ipblock_table').DataTable();
    
    $('#add_blockip_btn').click(function(e) {
        
        $('#add_blockip').modal('show');

    });
    
    $('#add_blockip_form').submit(function(e) {
        e.preventDefault();
        var block_ip = $('input[name=block_ip]').val();
        var block_description = $('#block_description').val();           
        
        // console.log(name +' '+ email);                    
        var params = [
            $('input[name=block_ip]'),
            $('#block_description')
        ];

        for(var i = 0; i < params.length; i++) {
            var val = params[i].val();
            
            if(val == '') {
                params[i].css('border', 'solid 1px red');
            } else {
                params[i].css('border', 'solid 1px #ddd');
            }
        }

        if(block_ip != '' && block_description != '') {
            $.ajax({
                url: '/admin_dev/ipblock/add',
                method: 'post',
                data: {
                    block_ip: block_ip,
                    block_description: block_description
                },
                success: function(data) {
                    
                    if(data != "0"){
        
                        table3.row.add( [
                            data,
                            block_ip,
                            block_description,
                            '<span class="btn btn-info edit-blocked-ip" style="width:70px;" role="button" data-id=' + data + ' data-ip="' + block_ip + '" data-desc="' + block_description + '" >Edit</span> <span class="btn btn-danger delete-blocked-ip" style="width:70px;" role="button" data-id="' + data + '">Delete</span>'
                        ] ).draw();
                    }
                    $('#add_blockip').modal('hide');                        
                }
            });
        }
    });
    $('#ipblock_table').on('click', '.edit-blocked-ip', function () {
        
        var block_id = $(this).data("id");
        var block_ip = $(this).data("ip");
        var block_desc = $(this).data("desc");
        
        var tr_point = $(this).closest('tr');
                
        $('#edit_blockip_lavel').html('IP : ' + block_ip + '<br><br>');
        $('#edit_block_description').val(block_desc);
        
        $('#edit_blockip').modal('show');

        $('#edit_blockip_form').submit(function(e) {
            e.preventDefault();
            
            var block_description = $('#edit_block_description').val();           
            
            var params = [            
                $('#edit_block_description')
            ];

            for(var i = 0; i < params.length; i++) {
                var val = params[i].val();
                
                if(val == '') {
                    params[i].css('border', 'solid 1px red');
                } else {
                    params[i].css('border', 'solid 1px #ddd');
                }
            }

            if(block_description != '') {
                $.ajax({
                    url: '/admin_dev/ipblock/edit',
                    method: 'post',
                    data: {                 
                        block_id: block_id,
                        block_description: block_description
                    },
                    success: function(data) {
                        table3.cell( tr_point , 2 ).data( block_description );    
                        $('#edit_blockip').modal('hide');                        
                    }
                });
            }
        });
    });                                  
    
    $('#ipblock_table').on('click', '.delete-blocked-ip', function () {
        var block_id = $(this).data("id");
        $.ajax({
                    url: '/admin_dev/ipblock/delete',
                    method: 'post',
                    data: {                 
                        block_id: block_id
                    },
                    success: function(data) {
                                                  
                    }
        });
        
        var tr = $(this).parents('tr');
        var row = table3.row(tr);
        var rowNode = row.node();
        row.remove();
        table3.draw();        
    });


            
} );





