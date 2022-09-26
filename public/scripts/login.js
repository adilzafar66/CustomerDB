jQuery(function () {
	let form = $('form');
	let submitBtn = $('.submit-btn');

	submitBtn.on('click', (event) => {
		event.preventDefault();

		$.ajax({
			method: 'POST',
			url: '/login',
			contentType: 'application/json',
			data: JSON.stringify(getFormData(form))
		})
        .done((res) => {
            if (res.user) {
                this.location.assign('/');
            }
        })
        .fail((err) => {
            console.log(err.responseJSON);
        });
	});

	function getFormData(form) {
		var unindexed_array = form.serializeArray();
		var indexed_array = {};

		$.map(unindexed_array, function (n, i) {
			indexed_array[n['name']] = n['value'];
		});

		return indexed_array;
	}
});
