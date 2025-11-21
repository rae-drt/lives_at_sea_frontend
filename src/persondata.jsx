import { useParams } from 'react-router';
import { Stack, Card } from '@mui/material';
import { useDialogs } from '@toolpad/core/useDialogs';

import { isNew, RATING_LAYOUT, OFFICER_LAYOUT } from './data_utils';
import { failedMutationDialog } from './queries.js';
import NewPersonControlPanel from './newpersoncontrolpanel';
import ExistingPersonControlPanel from './existingpersoncontrolpanel';
import PersonTableControlPanel from './persontablecontrolpanel';
import PersonTable from './persontable';

export default function PersonData({record}) {
  const dialogs = useDialogs();
  const { sailorType, nameId } = useParams();
  const { data, setData, mutation } = record;
  return (
    <Stack direction='row' width={0.9} alignItems='flex-start'>
      <Card variant='outlined'>
        <PersonTableControlPanel data={data} onChange={(()=>{
          mutation.mutate(data, {
            onError: failedMutationDialog(dialogs, mutation),
          });
        })}/>
        {
          <PersonTable data={data} onChange={setData} rowCells={8}
            rows={sailorType === 'officer' ?
              OFFICER_LAYOUT :
              isNew(nameId) ?
                [{labels: {'ADM': 2}, fields :{series: 1, piece: 1, nameid: 1}}, ...RATING_LAYOUT] :
                RATING_LAYOUT
            }
          />
        }
      </Card>
      {
      isNew(nameId) ?
        <NewPersonControlPanel data={data} onChange={setData}/>
      :
        <ExistingPersonControlPanel data={data} onChange={setData}/>
      }
    </Stack>
  );
}
