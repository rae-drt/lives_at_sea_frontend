export function catref(data) {
  return 'ADM ' + data.series + '/' + data.piece + '/' + data.nameid;
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

export const RATING_LAYOUT = [
    {labels: {'Forename, surname': 2},      fields: {forename: 3, surname:3}},
    {labels: {'Official number': 2},        fields: {officialnumber: 3}},
    {labels: {'Born': 2},                   fields: {birthday: 1, birthmonth: 1, birthyear: 1}},
    {labels: {'Birth place, county': 2},    fields: {birthplace: 3, birthcounty: 3}},
    {labels: {'Occupation': 2},             fields: {occupation: 3}},
    {labels: {'Discharge date, reason': 2}, fields: {dischargeday: 1, dischargemonth: 1, dischargeyear: 1, dischargereason: 3}}
];

export const SERVICE_FIELDS = [
  'ship',
  'rating',
  'fromday',
  'frommonth',
  'fromyear',
  'today',
  'tomonth',
  'toyear',
];

export const OFFICER_LAYOUT = [RATING_LAYOUT[0], RATING_LAYOUT[2], RATING_LAYOUT[3]];
