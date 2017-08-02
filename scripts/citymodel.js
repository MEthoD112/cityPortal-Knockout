import { _ } from 'underscore';
import ko from 'knockout';
import { AreaModel } from './areamodel';
import { constants } from './constants';

function CityModel(model) {
    const self = this;
    this.id = _.uniqueId();
    this.name = ko.observable(model.name);
    this.country = ko.observable(model.country);
    this.isIndustrial = ko.observable(model.isIndustrial);
    this.isCriminal = ko.observable(model.isCriminal);
    this.isPolluted = ko.observable(model.isPolluted);

    self.formAreaModels = function () {
        const arr = [];
        model.cityAreas.forEach((item) => {
            arr.push(new AreaModel(item));
        });
        return arr;
    };
    
    this.cityAreas = ko.observableArray(self.formAreaModels());

    self.addArea = function (area) {
        self.cityAreas.push(new AreaModel(area));
    }.bind(this);

    self.editArea = function (area) {
        self.cityAreas.push(new AreaModel(area));
    }.bind(this);

    self.deleteArea = function (area) {
        self.cityAreas.remove(area);
    }.bind(this);

    self.toggleIndustrial = function () {
        const bool = self.isIndustrial() === 'true' ? 'false' : 'true';
        self.isIndustrial(bool);
    }.bind(this);

    self.toggleCriminal = function () {
        const bool = self.isCriminal() === 'true' ? 'false' : 'true';
        self.isCriminal(bool);
    }.bind(this);

    self.togglePolluted = function () {
        const bool = self.isPolluted() === 'true' ? 'false' : 'true';
        self.isPolluted(bool);
    }.bind(this);

    self.formAreasString = ko.computed(() => {
        const arr = [];
        const areas = JSON.parse(ko.toJSON(self.cityAreas()));
        for (let i = 0; i < areas.length; i++) {
            arr.push(areas[i].name);
        }
        return arr.length ? arr.join(' ,'): constants.noAreas;
    });
}

export { CityModel };
