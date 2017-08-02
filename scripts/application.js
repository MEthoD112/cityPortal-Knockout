import $ from 'jquery';
import ko from 'knockout';

import { CityModel } from './citymodel';
import { AreaModel } from './areamodel';
import { constants } from './constants';

function CityViewModel() {
  const self = this;
  this.mainContainer = $('#cities');
  this.citiesList = $('#cities-list');
  this.cityModal = $('#myModal');
  this.cityModalLabel = $('#myModalLabel');
  this.errorCity = $('#city-error');
  this.inputCity = $('#addnewcity');
  this.inputCountry = $('#addnewcountry');
  this.saveCity = $('#save-new-city');
  this.saveArea = $('#save-area');
  this.areaModal = $('#areaModal');
  this.areaModalLabel = $('#myModalLabelForEdit');
  this.errorArea = $('#area-error');
  this.inputArea = $('#areaname');
  this.inputDescription = $('#areadescription');
  this.inputCitizenAmount = $('#areacitizens');
  this.inputSearchCity = $('#input-search-cities');
  this.inputSearchCountry = $('#input-search-countries');

  self.initCitiesSearch = function (collection) {
    this.citiesList.empty();
    collection.forEach((item) => {
      const option = $('<option>').val(item.name);
      this.citiesList.append(option);
    });
  };

  // Gettin data from localStorage when app starts
  self.cities = function () {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    self.initCitiesSearch(cities);
    return cities;
  };

  // Form the collection of cityModels
  self.citiesArray = function () {
    const arr = [];
    self.cities().forEach((item) => {
      arr.push(new CityModel(item));
    });
    return arr;
  };

  // Make citiesCollection observable
  self.citiesCollection = ko.observableArray(self.citiesArray());

  self.cityFilter = ko.observable();

  self.filterProducts = ko.computed(() => {
    if (!self.cityFilter()) {
      return self.citiesCollection();
    } else if (self.filterMode === 'city') {
      return ko.utils.arrayFilter(self.citiesCollection(), (city) => {
        return city.name() == self.inputSearchCity.val();
      });
    } else if (self.filterMode === 'country') {
      return ko.utils.arrayFilter(self.citiesCollection(), (city) => {
        return city.country() == self.inputSearchCountry.val();
      });
    } else if (self.filterMode === 'attr') {

    } else {

    }
  });

  self.filterCity = function () {
    self.filterMode = 'city'; 
    if (!self.inputSearchCity.val()) {
      return;
    }
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    const bool = cities.some((item) => {
      return item.name.toUpperCase() === self.inputSearchCity.val().toUpperCase();
    });

    if (!bool) {
      self.inputSearchCity.val('');
      self.mainContainer.prepend(`<h3 class="city-error" id="city-error-main">${constants.alertNoCities}</h3>`);
      return;
    }
    
    self.cityFilter(self.filterProducts());
    self.inputSearchCity.val('');
    $('#city-error-main').remove();
  };

  self.filterCountry = function () {
    self.filterMode = 'country'; 
    if (!self.inputSearchCountry.val()) {
      return;
    }
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    const bool = cities.some((item) => {
      return item.country.toUpperCase() === self.inputSearchCountry.val().toUpperCase();
    });

    if (!bool) {
      self.inputSearchCountry.val('');
      $('#countries-error').html(constants.alertNoCountries);
      return;
    }
    self.cityFilter(self.filterProducts());
    self.inputSearchCountry.val('');
    $('#countries-error').html('');
    $('#dropdown-menu').removeClass('open');
  };
  self.filterAttr = function () {
    self.filterMode = 'attr'; 
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    const bool = cities.some((item) => {
      return item.country.toUpperCase() === self.inputSearchCountry.val().toUpperCase();
    });

    if (!bool) {
      self.inputSearchCountry.val('');
      $('#countries-error').html(constants.alertNoCountries);
      return;
    }
    self.cityFilter(self.filterProducts());
    self.inputSearchCountry.val('');
    $('#countries-error').html('');
    $('#dropdown-menu').removeClass('open');
  };

  self.filterCitizen = function () {
    self.filterMode = 'country'; 
    if (!self.inputSearchCountry.val()) {
      return;
    }
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    const bool = cities.some((item) => {
      return item.country.toUpperCase() === self.inputSearchCountry.val().toUpperCase();
    });

    if (!bool) {
      self.inputSearchCountry.val('');
      $('#countries-error').html(constants.alertNoCountries);
      return;
    }
    self.cityFilter(self.filterProducts());
    self.inputSearchCountry.val('');
    $('#countries-error').html('');
    $('#dropdown-menu').removeClass('open');
  };

  self.resetFilter = function () {
    self.cityFilter(null);
    $('#city-error-main').remove();
  };

  // Add city model
  self.addOrEditCity = function (item, event) {
    if ($(event.target).attr('data-mode') === 'add') {
      if (!this.validateCity()) {
        return;
      }
      self.citiesCollection.push(new CityModel(self.createCity()));
    } else {
      if (!this.validateCity('edit')) {
        return;
      }
      self.citiesCollection()[self.index].name(self.inputCity.val());
      self.citiesCollection()[self.index].country(self.inputCountry.val());
      self.citiesCollection()[self.index].isIndustrial($('#i').attr('data-act'));
      self.citiesCollection()[self.index].isCriminal($('#c').attr('data-act'));
      self.citiesCollection()[self.index].isPolluted($('#p').attr('data-act'));
    }
    localStorage.setItem('cities', self.output());
    self.cities();
    this.cityModal.modal('hide');
  };

  // Form city model
  self.createCity = function () {
    const model = {
      name: $('#addnewcity').val(),
      country: $('#addnewcountry').val(),
      isIndustrial: $('#i').attr('data-act'),// === 'true' ? true : false,
      isCriminal: $('#c').attr('data-act'),// === 'true' ? true : false,
      isPolluted: $('#p').attr('data-act'),// === 'true' ? true : false,
      cityAreas: []
    };
    return model;
  };

  self.addOrEditArea = function () {
    if (self.saveArea.attr('data-mode') === 'add') {
      if (!self.validateArea()) {
        return;
      }
      self.citiesCollection()[self.indexCity].addArea(self.createArea());
      //this.errorArea.html('');
    } else {
      if (!self.validateArea('edit')) {
        return;
      }
      self.citiesCollection()[self.indexCity].cityAreas()[self.indexArea].name(self.inputArea.val());
      self.citiesCollection()[self.indexCity].cityAreas()[self.indexArea].description(self.inputDescription.val());
      self.citiesCollection()[self.indexCity].cityAreas()[self.indexArea].citizenAmount(self.inputCitizenAmount.val());
    }
    localStorage.setItem('cities', ko.toJSON(self.citiesCollection()));
    this.areaModal.modal('hide');
  };

  self.createArea = function () {
    const model = {
      name: $('#areaname').val(),
      description: $('#areadescription').val(),
      citizenAmount: $('#areacitizens').val()
    };
    return model;
  };

  self.findIndex = function (id) {
    const found = ko.utils.arrayFirst(self.citiesCollection(), (child) => {
      return child.id === id;
    });
    return self.citiesCollection().indexOf(found);
  };

  // Prepare city models collection for loading to localStorage
  self.output = ko.computed(() => {
    return ko.toJSON(self.citiesCollection());
  });

  self.deleteCity = function (city) {
    self.citiesCollection.remove(city);
    localStorage.setItem('cities', self.output());
    self.cities();
  };

  self.deleteArea = function (item, event) {
    const areaId = $(event.target).attr('data-id');
    const cityId = $(event.target).parent().parent().parent().parent().attr('id');
    const cityIndex = self.findIndex(cityId);
    const area = self.findArea(cityIndex, areaId);
    self.citiesCollection()[cityIndex].deleteArea(area);
    localStorage.setItem('cities', ko.toJSON(self.citiesCollection()));
  };

  self.findArea = function (cityIndex, areaId) {
    const found = ko.utils.arrayFirst(self.citiesCollection()[cityIndex].cityAreas(), (area) => {
      return area.id === areaId;
    });
    return found;
  };

  self.toggleIndustrial = function (item, event) {
    const id = $(event.target).parent().attr('data-id');
    const index = self.findIndex(id);
    self.citiesCollection()[index].toggleIndustrial();
    localStorage.setItem('cities', self.output());
  };

  self.toggleCriminal = function (item, event) {
    const id = $(event.target).parent().attr('data-id');
    const index = self.findIndex(id);
    self.citiesCollection()[index].toggleCriminal();
    localStorage.setItem('cities', self.output());
  };

  self.togglePolluted = function (item, event) {
    const id = $(event.target).parent().attr('data-id');
    const index = self.findIndex(id);
    self.citiesCollection()[index].togglePolluted();
    localStorage.setItem('cities', self.output());
  };

  self.openModalForEditCity = function () {
    const cityId = $(event.target).attr('data-id');
    self.index = self.findIndex(cityId);
    self.cityModal.modal('show');
    self.cityModalLabel.html(constants.editCity);
    self.errorCity.html('');
    self.inputCity.val(self.citiesCollection()[self.index].name());
    self.cityName = self.citiesCollection()[self.index].name();
    self.inputCountry.val(self.citiesCollection()[self.index].country());
    const isIndustrial = self.citiesCollection()[self.index].isIndustrial();
    const isCriminal = self.citiesCollection()[self.index].isCriminal();
    const isPolluted = self.citiesCollection()[self.index].isPolluted();
    $('#i').attr('data-act', isIndustrial);
    $('#c').attr('data-act', isCriminal);
    $('#p').attr('data-act', isPolluted);

    const iColor = isIndustrial === 'true' ? constants.activeColor : constants.noActiveColor;
    const cColor = isCriminal === 'true' ? constants.activeColor : constants.noActiveColor;
    const pColor = isPolluted === 'true' ? constants.activeColor : constants.noActiveColor;

    $('#i').css('background', iColor);
    $('#c').css('background', cColor);
    $('#p').css('background', pColor);

    self.saveCity.attr('data-mode', 'edit');
  };

  self.openModalForAddingArea = function () {
    self.cityId = $(event.target).attr('data-id');
    self.indexCity = self.findIndex(self.cityId);
    self.saveArea.attr('data-mode', 'add');
    self.areaModalLabel.html(constants.addArea);
    self.errorArea.html('');
    self.inputArea.val('');
    self.inputDescription.val('');
    self.inputCitizenAmount.val('');

  };

  // Open modal window for edditing area
  self.openModalForEditArea = function (item, event) {
    self.areaId = $(event.target).attr('data-id');
    self.cityId = $(event.target).parent().parent().parent().parent().attr('id');
    self.saveArea.attr('data-mode', 'edit');
    self.areaModalLabel.html(constants.editArea);
    self.errorArea.html('');
    self.indexCity = self.findIndex(self.cityId);
    const area = self.findArea(self.indexCity, self.areaId);
    self.indexArea = self.citiesCollection()[self.indexCity].cityAreas().indexOf(area);
    self.areaName = area.name();
    self.inputArea.val(area.name());
    self.inputDescription.val(area.description());
    self.inputCitizenAmount.val(area.citizenAmount());
  };

  // Validate created or eddited city
  self.validateCity = function (mode) {
    if (!self.inputCity.val().trim()) {
      self.errorCity.html(constants.alertMessageForCity);
      return false;
    }
    if (!self.inputCountry.val().trim()) {
      self.errorCity.html(constants.alertMessageForCountry);
      return false;
    }
    if (mode === 'edit') {
      if (self.cityName === self.inputCity.val()) {
        return true;
      }
    }
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    const bool = cities.every((item) => {
      return item.name.toUpperCase() !== self.inputCity.val().toUpperCase();
    });

    if (!bool) {
      self.errorCity.html(constants.alertMessageForExistingCity);
      return false;
    }
    return true;
  };

  // Validate created or eddited area
  self.validateArea = function (mode) {
    if (!self.inputArea.val().trim() ||
      !self.inputDescription.val().trim() ||
      !self.inputCitizenAmount.val().trim()) {
      self.errorArea.html(constants.alertMessageForAreaFields);
      return false;
    }
    if (!parseInt(self.inputCitizenAmount.val()) || parseInt(self.inputCitizenAmount.val()) < 1) {
      self.errorArea.html(constants.alertMessageForAreaCitizens);
      return false;
    }
    if (mode === 'edit') {
      if (self.areaName === self.inputArea.val()) {
        return true;
      }
    }
    const cities = JSON.parse(ko.toJSON(self.citiesCollection()));
    if (cities[self.indexCity].cityAreas.length <= 1) {
      return true;
    }
    const bool = cities[self.indexCity].cityAreas.every((item) => {
      return item.name.toUpperCase() !== self.inputArea.val().toUpperCase();
    });
    if (!bool) {
      self.errorArea.html(constants.alertMessageForExistingArea);
      return false;
    }
    return true;
  };
};

export { CityViewModel };
