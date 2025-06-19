import { create } from 'zustand';
import { useBlocker, matchRoutes } from 'react-router';

export const useDirty = create((set)=> ({
  person: false,
  services: false,
  otherdata: false,
  otherservices: false,
  setDirty: (key) => set(()=>({[key]: true})),
  setClean: (key) => set(()=>({[key]: false})),
}));

export function useDirtyBlocker() {
  const dirty = useDirty();
  function block({currentLocation, historyAction, nextLocation}) {
    function getMatchParams(loc) {
      const matches = matchRoutes([
        {path: ':sailorType/:nameId/:dataType'},
      ], loc);

      //no matches
      if(matches === null || matches.length === 0) return null;

      //react-router documentation is awful. This function returns an array, I presume in case we match more than one of the given routes.
      if(matches.length > 1) throw new Error('Too many matches'); //Just blow up if the return is surprising

      const params = matches[0].params;
      //throw an error if my assumptions break
      //(breakage here is on me, not on the bad react-router documentation)
      const keys = Object.keys(params);
      if(!(keys.length === 3 &&
           keys.includes('sailorType') &&
           keys.includes('nameId') &&
           keys.includes('dataType'))) {
        throw new Error('Bad params: ' + JSON.stringify(params));
      }
      return params;
    }

    //If the only dirty data is in the person table and we are switching tabs then we should not block, no dirty data will be lost
    //Tab switch should change the :dataType parameter only (or alternatively, not change the other parameters)

    const dirtyTabs = dirty.services || dirty.otherdata || dirty.otherservices;

    const current = getMatchParams(currentLocation); //is from current location, so should always match for current contexts
    const next = getMatchParams(nextLocation); //may be null if we are navigating away

    if(next !== null) {
      if(current.sailorType === next.sailorType &&
         current.nameId === next.nameId) {
        console.log('Just checking tabs');
        return dirtyTabs;
      }
    }
    //Block other forms of navigation if there is any dirty data
    return (dirty.person || dirtyTabs);
  }

  const blocker = useBlocker(block);
  return blocker;
}
