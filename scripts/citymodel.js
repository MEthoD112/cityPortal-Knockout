import { _ } from 'underscore';
import ko from 'knockout';
import { AreaModel } from './areamodel';
import { constants } from './constants';

function CityModel(model) {
    const self = this;
    this.id = ko.observable(_.uniqueId());
    this.name = ko.observable(model.name);
    this.country = ko.observable(model.country);
    this.isIndustrial = ko.observable(model.isIndustrial);
    this.isCriminal = ko.observable(model.isCriminal);
    this.isPolluted = ko.observable(model.isPolluted);

    // Form areamodel for citymodel
    self.formAreaModels = function () {
        return model.cityAreas.map((item) => {
            return new AreaModel(item);
        });
    };
    
    // Observable attribute of citymodel
    this.cityAreas = ko.observableArray(self.formAreaModels());

    // Add area to citymodel
    self.addArea = function (area) {
        self.cityAreas.push(new AreaModel(area));
    }.bind(this);;

    // Edit area of citymodel
    self.editArea = function (area) {
        self.cityAreas.push(new AreaModel(area));
    }.bind(this);;

    // Delete area from citymodel
    self.deleteArea = function (area) {
        self.cityAreas.remove(area);
    }.bind(this);;

    // Toggle attribute isIndustrial
    self.toggleIndustrial = function () {
        const bool = self.isIndustrial() === 'true' ? 'false' : 'true';
        self.isIndustrial(bool);
    }.bind(this);

    // Toggle attribute isCriminal
    self.toggleCriminal = function () {
        const bool = self.isCriminal() === 'true' ? 'false' : 'true';
        self.isCriminal(bool);
    }.bind(this);

    // Toggle attribute isPolluted
    self.togglePolluted = function () {
        const bool = self.isPolluted() === 'true' ? 'false' : 'true';
        self.isPolluted(bool);
    }.bind(this);

    // Form string of area names
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
