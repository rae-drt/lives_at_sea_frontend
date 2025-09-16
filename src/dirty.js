import { useBlocker, matchRoutes } from 'react-router';
import { useRecord } from './queries';
import { createContext } from 'react';
import { isEqual } from 'lodash';
import { PERSON_FIELD_TYPES } from './data_utils';

class Dirty {
  any() {
    return Object.values(this).some((x)=>x);
  }
}

class DirtySailor extends Dirty {
  constructor(name, service, service_other, data_other) {
    super();
    this.name = name;
    this.service = service;
    this.service_other = service_other;
    this.data_other = data_other;
  }
}


export const DirtySailorContext = createContext(new DirtySailor(false, false, false, false));

export function useDirtySailor(sailorType, nameId) {
  const {data: nameRecord, queryData: nameQuery } = useRecord(sailorType, nameId, 'name');
  const {data: servicesRecord, queryData: servicesQuery } = useRecord(sailorType, nameId, 'service');
  const {data: otherServicesRecord, queryData: otherServicesQuery } = useRecord(sailorType, nameId, 'service_other');
  const {data: otherDataRecord, queryData: otherDataQuery} = useRecord(sailorType, nameId, 'data_other');

  //TODO: Nasty hack to deal with blank and zero being equivalent. There must be a better
  //      way that does not involve special handling in this component.
  const clonedNameRecord = structuredClone(nameRecord);
  if(clonedNameRecord) {
    for(const field of Object.getOwnPropertyNames(clonedNameRecord)) {
      if(clonedNameRecord[field] === '' && PERSON_FIELD_TYPES[field] === 'number') {
        clonedNameRecord[field] = 0;
      }
      if(PERSON_FIELD_TYPES[field] === 'text') { //TODO
        if(clonedNameRecord[field]) {
          clonedNameRecord[field] = clonedNameRecord[field].trim();
          if(clonedNameRecord[field] === "") {
            clonedNameRecord[field] = null;
          }
        }
      }
    }
  }

  return new DirtySailor(
    !(isEqual(clonedNameRecord, nameQuery)),
    !(isEqual(servicesRecord, servicesQuery)),
    !(isEqual(otherServicesRecord, otherServicesQuery)),
    !(isEqual(otherDataRecord, otherDataQuery)),
  );
}

//Block if we are navigating away from the current sailor's record and there is any dirty data
export function useDirtySailorBlocker(dirty) {
  function block({currentLocation, nextLocation}) {
    function getMatchParams(loc) {
      const matches = matchRoutes([
        {path: ':sailorType/:nameId'},
      ], loc);

      //no matches
      if(matches === null || matches.length === 0) return new Error(); //Should not be able to happen

      //react-router documentation is awful. This function returns an array, I presume in case we match more than one of the given routes.
      if(matches.length > 1) throw new Error('Too many matches'); //Just blow up if the return is surprising

      const params = matches[0].params;
      //throw an error if my assumptions break
      //(breakage here is on me, not on the bad react-router documentation)
      const keys = Object.keys(params);
      if(!(keys.length === 2 &&
           keys.includes('sailorType') &&
           keys.includes('nameId'))) {
        throw new Error('Bad params: ' + JSON.stringify(params));
      }
      return params;
    }

    const current = getMatchParams(currentLocation); //is from current location, so should always match for current contexts
    const next = getMatchParams(nextLocation); //may be null if we are navigating away

    if(next !== null) {
      if(current.sailorType === next.sailorType &&
         current.nameId === next.nameId) {
        return false;
      }
    }
    return dirty.any();
  }

  return(useBlocker(block));
}
