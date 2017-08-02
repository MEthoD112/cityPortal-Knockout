import { _ } from 'underscore';
import ko from 'knockout';

function AreaModel(model) {
    this.id = _.uniqueId();
    this.name = ko.observable(model.name);
    this.description = ko.observable(model.description);
    this.citizenAmount = ko.observable(model.citizenAmount);
}

export { AreaModel };
