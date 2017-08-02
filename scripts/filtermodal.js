import $ from 'jquery';
import { constants } from './constants';
import { cityView } from './app'

export class FilterModal {
    constructor() {
        this.cityModal = $('#modal-city');
        this.filterAttr = $('#filter-attributes');
        this.dropDownButton = $('#dropdown-button');
        this.countriesError = $('#countries-error');
        this.inputMaxCitizens = $('#max-value-citizens');
        this.inputMinCitizens = $('#min-value-citizens');
        this.inputSearchCountry = $('#input-search-countries');
        this.attrError = $('#atrributes-error');
        this.citizError = $('#citizens-error');
        this.isIndustrilaAttr = $('#i-filter');
        this.isCriminalAttr = $('#c-filter');
        this.isPollutedAttr = $('#p-filter');
        this.addCityButton = $('#add-new-city-button');
        this.cityModalLabel = $('#myModalLabel');
        this.inputCity = $('#addnewcity');
        this.inputCountry = $('#addnewcountry');
        this.errorCity = $('#city-error');
        this.saveCity = $('#save-new-city');
        this.countriesList = $('#countries-list');

        // Open modal window for adding city
        this.addCityButton.on('click', () => {
            this.cityModalLabel.html(constants.addCity);
            this.inputCity.val('');
            this.inputCountry.val('');
            this.errorCity.html('');
            $('#i').attr('data-act', 'true');
            $('#c').attr('data-act', 'false');
            $('#p').attr('data-act', 'false');
            $('#i').css('background', constants.activeColor);
            $('#c').css('background', constants.noActiveColor);
            $('#p').css('background', constants.noActiveColor);
            this.saveCity.attr('data-mode', 'add');
        });

        // Event for toggling attributes in city modal window
        this.cityModal.on('click', (event) => {
            const id = event.target.id;
            if (id === 'c' || id === 'p' || id === 'i') {
                this.toggleColor(event.target);
            }
        });

        // Event for toggling attributes in filter window
        this.filterAttr.on('click', (event) => {
            const id = event.target.id;
            if (id === 'c-filter' || id === 'p-filter' || id === 'i-filter') {
                this.toggleColor(event.target);
            }
        });

        // Event for open filter window
        this.dropDownButton.on('click', () => {
            this.countriesError.html('');
            this.inputSearchCountry.val('');
            this.attrError.html('');
            this.citizError.html('');
            this.isIndustrilaAttr.attr('data-act', 'true');
            this.isCriminalAttr.attr('data-act', 'false');
            this.isPollutedAttr.attr('data-act', 'false');
            this.isIndustrilaAttr.css('background', constants.activeColor);
            this.isCriminalAttr.css('background', constants.noActiveColor);
            this.isPollutedAttr.css('background', constants.noActiveColor);
            const arrOfMinAndMax = this.findMinAndMaxValuesOfCitizens(JSON.parse(localStorage.getItem('cities')));
            this.inputMaxCitizens.val(arrOfMinAndMax[1]);
            this.inputMinCitizens.val(arrOfMinAndMax[0]);
            this.initCountriesList(JSON.parse(localStorage.getItem('cities')));
        });
    };

    // Toggle attributes
    toggleColor(target) {
        if (target.getAttribute('data-act') === 'true') {
            target.style.background = constants.noActiveColor;
            target.setAttribute('data-act', 'false');
        } else {
            target.style.background = constants.activeColor;
            target.setAttribute('data-act', 'true');
        }
    };

    // Find max and min value of citizens
    findMinAndMaxValuesOfCitizens(collection) {
        const arr = [];
        collection.forEach((item) => {
            item.cityAreas.forEach((item) => {
                if (item.citizenAmount) {
                    arr.push(item.citizenAmount)
                }
            });
        });
        arr.sort((a, b) => { return a - b });
        return [arr[0], arr[arr.length - 1]];
    };

    // Rerender countries list in search datalist
    initCountriesList(collection) {
        this.countriesList.empty();
        const arr = [];
        collection.forEach((item) => {
        if (arr.indexOf(item.country) === -1) {
            arr.push(item.country);
            const option = $('<option>').val(item.country);
            this.countriesList.append(option);
        }
        });
    };
}
