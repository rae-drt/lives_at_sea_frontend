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

export const RATING_FIELDS = [
    'forename',
    'surname',
    'officialnumber',
    'birthday',
    'birthmonth',
    'birthyear',
    'birthplace',
    'birthcounty',
    'occupation',
    'dischargeday',
    'dischargemonth',
    'dischargeyear',
    'dischargereason',
];

export const OFFICER_FIELDS = [
  RATING_FIELDS[0], //forename
  RATING_FIELDS[1], //surname
  RATING_FIELDS[3], //birthday
  RATING_FIELDS[4], //birthmonth
  RATING_FIELDS[5], //birthyear
  RATING_FIELDS[6], //birthplace
  RATING_FIELDS[7], //birthcounty
];

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

export const OFFICER_LAYOUT = [
  RATING_LAYOUT[0], //forename, surname
  RATING_LAYOUT[2], //born (date)
  RATING_LAYOUT[3], //born (location)
];

export function convert_to_date(obj, dayField, monthField, yearField) {
  if(yearField in obj && monthField in obj && dayField in obj) {
    if(obj[monthField] < 10) { obj[monthField] = '0' + obj[monthField]; }
    if(obj.birthday   < 10) { obj[dayField]  = '0' + obj[dayField]; }
    obj.birthdate = obj[yearField] + '-' + obj[monthField] + '-' + obj[dayField];
  }
  delete obj[yearField];
  delete obj[monthField];
  delete obj[dayField];
}
