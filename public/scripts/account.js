import * as utils from './utils.js';
/************************* NAVIGATION FLYOUT *****************************/

const navFlyout = document.querySelector(".navbar");
const navCollapsedWidth = "2%";
const navExpandedWidth = "20%";
const navToggle = navFlyout.firstElementChild;
const navCollapseIcon = document.querySelector(".fa-angle-left");
const navExpandIcon = document.querySelector(".fa-angle-right");

function navFlyoutCollapse() {
    
    navCollapseIcon.classList.add('hidden');
    navExpandIcon.classList.remove('hidden');
    navFlyout.style.width = navCollapsedWidth;
    Array.from(navFlyout.children).forEach(element => {
        if (element !== navToggle){
            element.style.opacity = '0%';
        }
    });
    navExpandIcon.addEventListener("click", navFlyoutExpand);
}

function navFlyoutExpand() {

    navExpandIcon.classList.add('hidden');
    navCollapseIcon.classList.remove('hidden');
    navFlyout.style.width = navExpandedWidth;
    Array.from(navFlyout.children).forEach(element => {
        if (element !== navToggle){
            element.style.opacity = '100%';
        }
    });
    navCollapseIcon.addEventListener("click", navFlyoutCollapse);
    
}

navCollapseIcon.addEventListener("click", navFlyoutCollapse);

jQuery(function () {

    const content = $('.container');
    const flyoutElems = {
        'profile': $('#profile'), 
        'settings': $('#settings')
    };
    const profile = $('#profile');
    const settings = $('#settings');

    $.each(flyoutElems, (key, elem) => {
        elem.on('click', async function(e) {

            e.preventDefault();
            const res = await fetch(`/account/${key}`);
            content.html(res);
            content.fadeIn('slow');

            let saveBtn = $('.save-btn');
            let container = $('.container');

            saveBtn.on('click', () => {
                put(`/account/${key}`, container);
                console.log('HERE');
            });

        })
    });

    // profile.on('click', async function(e) {

    //     e.preventDefault();
    //     res = await fetch('/account/profile');
    //     content.html(res);
    //     content.fadeIn('slow');

    // });

    async function fetch(url) {
		const result = await $.ajax({
			method: 'GET',
			url: url,
			success: function (result) {
			}
		});
        return result;
	}

    async function put(url, elem) {

        try {
            
            const result = await $.ajax({
                method: 'PUT',
                url: url,
                contentType: 'application/json',
                data: await getJSONData(elem),
                success: function (result) {
                }
            });
            return result;

        } catch (error) {
            console.log(error);
        }
    }

    async function getJSONData(elem) {
		let data = {
			enableEdit: elem.find('input').prop('checked'),
			userId: await utils.getUserId()
		};
		return JSON.stringify(data);
	}

});
