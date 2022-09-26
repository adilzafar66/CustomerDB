import * as utils from './utils.js';

jQuery(async function () {
	let table = $('.data-table');
	let tableRows = $('.tbl-row');
	let deleteBtn = $('.delete-btn');
	let saveBtn = $('.save-btn');
	let cancelBtn = $('.cancel-btn');
	let importBtn = $('.import-btn');
	let newBtn = $('.new-btn');
	let checkAll = $('[name=tbl-check-all]');
	let checkBoxes = $('.checkbox [name=tbl-check-elem]');
	let importInput = $('#excel-import');
	let saveMsgBox = $('.save-msgbox');
	let errorMsgBox = $('.error-msgbox');
	let msgBoxCloseIcon = $('.close-msg');

	let newRowsIds = new Set();
	let deletedRowsIds = new Set();
	let editedRowsIds = new Set();

	const settings = await utils.fetch('/account/settings-json');
	if (settings.enableEdit) {
		tableRows.one('click', expandRow);
	}

	newBtn.on('click', () => {
		let inputs = {
			name: '',
			age: '',
			phone: '',
			email: ''
		};

		let tableRow = createTableRow(inputs);
		tableRow.one('click', expandRow);
		tableRow.trigger('click');
		setCheckAll();
	});

	deleteBtn.on('click', () => {
		let removedElems = $('input[name=tbl-check-elem]:checked')
			.parent()
			.parent()
			.remove();
		if (removedElems.length) {
			Array.from(removedElems).forEach((elem) => deletedRowsIds.add(elem.id));
			saveBtn.addClass('bg-alert');
			checkAll.prop('checked', false);
		}
	});

	cancelBtn.on('click', () => {
		editedRowsIds.clear();
		deletedRowsIds.clear();
		newRowsIds.clear();
		fetch();
	});

	saveBtn.on('click', () => {
		// Start loading icon
		let promises = [];

		deletedRowsIds.forEach((customerId) => {
			editedRowsIds.delete(customerId);
			if (newRowsIds.delete(customerId)) {
				return;
			}
			promises.push(ajaxDeleteCustomer(customerId));
		});

		newRowsIds.forEach((customerId) => {
			editedRowsIds.delete(customerId);
			let customer = $(table).find(`#${customerId}`);
			promises.push(ajaxPostCustomer(customer));
		});

		editedRowsIds.forEach((customerId) => {
			let customer = $(table).find(`#${customerId}`);
			if (!customer.length) {
				return;
			}
			promises.push(ajaxPutCustomer(customerId, customer));
		});

		$.when.apply(this, promises).done(() => {
			// End load icon
			saveMsgBox.slideToggle('slow');
			saveBtn.removeClass('bg-alert');
			fetch();
		});
	});

	importBtn.on('click', () => {
		importInput.trigger('click');
	});

	importInput.on('change', async () => {
		const workbook = await utils.getExcelWorkbook(importInput.prop('files')[0]);
		let sheet = workbook.Sheets[workbook.SheetNames[0]];
		let JSONdata = XLSX.utils.sheet_to_json(sheet);
		$.each(JSONdata, (i, elem) => {
			createTableRow(elem);
		});
		saveBtn.addClass('bg-alert');
		importInput.prop('value', '');
		resetTableClicks();
	});

	msgBoxCloseIcon.on('click', () => {
		saveMsgBox.fadeOut('fast');
		errorMsgBox.fadeOut('fast');
		errorMsgBox.promise().done(() => {
			errorMsgBox.find('span').remove();
		});
	});

	checkAll.on('click', () => {
		checkBoxes.prop('checked', checkAll.prop('checked'));
	});

	function expandRow(event) {
		let currentRow = $(event.delegateTarget);
		let doneBtn = currentRow.find('button');
		let tableElems = currentRow.children('.tbl-elem');

		if ($(event.target).is(currentRow.find('[name=tbl-check-elem]'))) {
			currentRow.one('click', expandRow);
			return;
		}

		currentRow.addClass('expanded');
		doneBtn.fadeIn('slow');

		tableElems.each((index, tableElem) => {
			let inputElem = createTextInput(tableElem);
			tableElem.innerHTML = '';
			tableElem.removeAttribute('id');
			$(tableElem).append(inputElem);
		});

		doneBtn.on('click', (event) => {
			event.stopPropagation();
			let emptyFlag = false;
			let emptyInputName = null;
			tableElems.find('input').each((index, tableElem) => {
				if (tableElem.value === '' && !emptyFlag) {
					emptyFlag = true;
					emptyInputName = tableElem.name;
				}
			});
			if (emptyFlag) {
				let msg = document.createElement('span');
				msg.innerText = `Error: Please enter ${emptyInputName}`;
				errorMsgBox.append(msg);
				errorMsgBox.fadeToggle('slow');
				return;
			}
			tableElems.find('input').each((index, tableElem) => {
				tableElem.parentElement.id = tableElem.id;
				$(tableElem).replaceWith(tableElem.value);
			});

			currentRow.removeClass('expanded');
			doneBtn.slideToggle('fast');
			currentRow.one('click', expandRow);
			doneBtn.off();
		});
	}

	function resetTableClicks() {
		setCheckAll();
		setExpandRow();
	}

	function setCheckAll() {
		let checkAll = $('[name=tbl-check-all]');
		let checkBoxes = $('.checkbox [name=tbl-check-elem]');
		checkAll.on('click', () =>
			checkBoxes.prop('checked', checkAll.prop('checked'))
		);
	}

	function setExpandRow() {
		table.find('.tbl-row').off();
		if (settings.enableEdit) {
			table.find('.tbl-row').one('click', expandRow);
		}
	}

	function createTableRow(tableElemsObj, inputs = false) {
		let tableRow = $(document.createElement('div'));
		tableRow.addClass('tbl-row');

		let tableElem = $(document.createElement('div'));
		tableElem.addClass('tbl-elem');

		tableRow.attr('id', `added-row-${tableRows.length + 1}`);
		tableRow.append(createCheckBox());

		$.each(tableElemsObj, (id, tableElemValue) => {
			let elem = tableElem.clone();
			elem.text(tableElemValue);
			elem.attr('id', id.toLowerCase());
			tableRow.append(elem);
		});

		tableRow.append(createDoneButton());
		table.append(tableRow);
		tableRows = tableRows.add(tableRow);
		newRowsIds.add(tableRow.attr('id'));

		return tableRow;
	}

	function createDoneButton() {
		let doneBtnContainer = $(document.createElement('div'));
		doneBtnContainer.addClass('done-btn');

		let doneBtn = $(document.createElement('button'));
		doneBtn.addClass('button');
		doneBtn.css('display', 'none');
		doneBtn.text('Done');

		doneBtnContainer.append(doneBtn);
		return doneBtnContainer;
	}

	function createCheckBox() {
		let checkBoxContainer = $(document.createElement('div'));
		checkBoxContainer.addClass('checkbox');

		let checkBox = $(document.createElement('input'));
		checkBox.attr({ type: 'checkbox', name: 'tbl-check-elem' });

		checkBoxContainer.append(checkBox);
		return checkBoxContainer;
	}

	function createTextInput(child) {
		let inputElem = $(document.createElement('input'));
		inputElem.attr({ type: 'text', id: child.id, name: child.id });
		inputElem.prop('value', child.innerText);
		inputElem.on('input', () => {
			saveBtn.addClass('bg-alert');
			editedRowsIds.add(inputElem.parents()[1].id);
		});

		return inputElem;
	}

	async function getJSONData(customer) {
		let data = {
			name: customer.find('#name').text(),
			age: customer.find('#age').text(),
			phone: customer.find('#phone').text(),
			email: customer.find('#email').text(),
			userId: await utils.getUserId()
		};
		return JSON.stringify(data);
	}

	// Database functions

	function ajaxDeleteCustomer(customerId) {
		return $.ajax({
			method: 'DELETE',
			url: `customers/${customerId}`,
			success: function (result) {
				console.log(result);
			}
		});
	}

	async function ajaxPostCustomer(customer) {
		return $.ajax({
			method: 'POST',
			url: '/customers/new/submit',
			contentType: 'application/json',
			data: await getJSONData(customer),
			success: function (result) {
				console.log(result);
			}
		});
	}

	async function ajaxPutCustomer(customerId, customer) {
		return $.ajax({
			method: 'PUT',
			url: `customers/${customerId}`,
			contentType: 'application/json',
			data: await getJSONData(customer),
			success: function (result) {
				console.log(result);
			}
		});
	}

	function fetch() {
		$.ajax({
			method: 'GET',
			url: 'customers/cancel',
			success: function (result) {
				table.children().remove();
				table.append(result);
				saveBtn.removeClass('bg-alert');
				checkAll.prop('checked', false);
				resetTableClicks();
			}
		});
	}
});
