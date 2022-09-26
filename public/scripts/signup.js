jQuery(function () {

    let form = $('form');
    let submitBtn = $('.submit-btn');

    submitBtn.on('click', (event) => {
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/signup',
            contentType: 'application/json',
            data: JSON.stringify(getFormData(form))
        })
        .done(res => {
            console.log("IN Done");
            console.log(res);
        })
        .fail((err) => {
            console.log(err.responseJSON);
        });
    });

    function getFormData(form){
        var unindexed_array = form.serializeArray();
        var indexed_array = {};
    
        $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
        });
    
        return indexed_array;
    }
});