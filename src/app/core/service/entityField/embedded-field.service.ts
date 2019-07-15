import {Injectable} from "@angular/core";
import {BaseStructureDateService} from "../base-structure-date.service";
import {StructureData, StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";


@Injectable()
export class EmbeddedFieldService extends BaseStructureDateService<string> {

  constructor(public websocketService: StructureDataSyncService) {
    super(websocketService);
  }

  getDataName(): string {
    return 'EmbeddedField'
  }

  getShowName():string{
    return 'Embedded Field'
  }
  emptyDescription(): string {
    return '';
  }

  fit(s: StructureDataCapsule): boolean {
    return s.dataName == this.getDataName();
  }
}
