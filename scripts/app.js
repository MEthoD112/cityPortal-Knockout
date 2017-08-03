import jQuery from 'jquery';
global.jQuery = jQuery;
global.jquery = jQuery;
global.$ = jQuery;
let Bootstrap = require('bootstrap');
import $ from 'jquery';
import ko from 'knockout';
const mapping = require('knockout-mapping');
ko.mapping = mapping;

import { CityViewModel } from './application';
import { FilterModal } from './filtermodal';

const cityView = new CityViewModel();
const filterModal = new FilterModal();

ko.applyBindings(cityView);

export { cityView };
