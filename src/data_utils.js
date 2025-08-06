import { isEqual } from 'lodash';

export function catref(data) {
  return 'ADM ' + data.series + '/' + data.piece + '/' + data.item;
}

export function officerref(data) {
  let retval = data.nameid;
  if(data.rating || data.forename || data.surname) {
    retval += ':';
    if(data.rating) {
      retval += ' ' + data.rating;
    }
    if(data.forename) {
      retval += ' ' + data.forename;
    }
    if(data.surname) {
      retval += ' ' + data.surname;
    }
  }
  return retval;
}

export function surname_officerref(data) {
  return (data.surname ? data.surname: '<unknown>') + ', ' + (data.forename ? data.forename : '<unknown>');
}

export const OFFICER_FIELDS = [
    'forename',
    'surname',
    'birthday',
    'birthmonth',
    'birthyear',
    'birthplace',
    'birthcounty',
];

export const RATING_LAYOUT = [
    {labels: {'Forename, surname': 2},      fields: {forename: 3, surname:3}},
    {labels: {'Official number': 2},        fields: {officialnumber: 3}},
    {labels: {'Born': 2},                   fields: {birthday: 1, birthmonth: 1, birthyear: 1}},
    {labels: {'Birth place, county': 2},    fields: {birthplace: 3, birthcounty: 3}},
    {labels: {'Occupation': 2},             fields: {occupation: 3}},
    {labels: {'Discharge date, reason': 2}, fields: {dischargeday: 1, dischargemonth: 1, dischargeyear: 1, dischargereason: 3}}
];

export const OFFICER_LAYOUT = [RATING_LAYOUT[0], RATING_LAYOUT[2], RATING_LAYOUT[3]];

export function init_data(type) {
  if(type !== 'officer') throw new Error('Non-officer values no longer supported');
  return OFFICER_FIELDS.reduce((a, b) => ({...a, [b]: ''}), {});
}

//TODO: Confirm that this contractually produces an empty string at parts[1] when there is no prefix
export function getOfficialNumber(n) {
  const re = new RegExp('^(\\D*)(\\d+)$');
  const parts = n.match(re);
  parts[2] = Number(parts[2]);
  return parts.slice(1);
}

export function getOfficialNumberDigits(n) {
  return getOfficialNumber(n)[1];
}

export function getOfficialNumberPrefix(n) {
  return getOfficialNumber(n)[0];
}

/*
Bit:              5             4            3            2          1
Meaning:    Updated    Reconciled    Complete2    Complete1    Started         STATUS         WORKFLOW
                                                                          0    Not Started    RATINGS
                                                                     1    1    Transcription  RATINGS
                                                          1          1    3    Transcription  RATINGS
                                             1                       1    5    Transcription  RATINGS
                                             1            1          1    7    Checking       RATINGS
                                1            1            1          1   15    Reconciled     RATINGS
                  1             1            1            1          1   31    Maintaining    RATINGS
*/
export function status_label(status_code) {
  switch(status_code) {
    case  0: return 'Not started';
    case  1:
    case  3:
    case  5: return 'Transcription';
    case  7: return 'Checking';
    case 15: return 'Reconciled';
    case 31: return 'Maintaining';
    default: return 'Process Error';
  }
}

export function same_services(services) {
  return isEqual(services[0].records, services[1].records);
}

export function status_encode(service_record) {
  let bitfield = 0;
  if(service_record.services[0].userid || service_record.services[1].userid) bitfield |= 1;
  if(service_record.services[0].complete) bitfield |= 2;
  if(service_record.services[1].complete) bitfield |= 4;
  if(service_record.reconciled) bitfield |= 8;
  return { status_code: bitfield, description: status_label(bitfield) };
}

//following https://stackoverflow.com/a/78205295
//preserves order, optionally requires all expected properties to exist in propMap
//SHALLOW copy permits quick operation.
export function rename_properties(obj, propMap, strict = true) {
  const newObj = {};
  const mismatch = strict ? (k, v) => { console.log(`Unexpected property ${k}`); throw Error(`Unexpected property ${k}`); }
                          : (k, v) => { obj[k] = v; }
  for(const [k, v] of Object.entries(obj)) {
    if(k in propMap) newObj[propMap[k]] = v;
    else mismatch(k, v);
  }
  return newObj;
}

