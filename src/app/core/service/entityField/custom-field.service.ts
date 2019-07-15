import {Injectable} from "@angular/core";
import {BaseStructureDateService} from "../base-structure-date.service";
import {FieldValueDescription} from "../../model/field-value-description";
import {StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";


@Injectable()
export class CustomFieldService extends BaseStructureDateService<FieldValueDescription> {
  constructor(public websocketService: StructureDataSyncService) {
    super(websocketService);
  }
  emptyDescription(): FieldValueDescription {
    return {
      output: false,
      valueDescriptions: []
    }
  }

  fit(s: StructureDataCapsule): boolean {
    return s.dataName == 'CustomField'
  }
}
