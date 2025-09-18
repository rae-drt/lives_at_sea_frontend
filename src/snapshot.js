import html2canvas from 'html2canvas';

function get_data(prefix, data) {
  if(data) {
    let link = document.createElement('a');
    link.download = prefix + '.json';
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
    link.click();
    link.remove();
  }
}

export function snapshot(id, display, sync_data, async_data, identifier) {
  const prefix = `LatS_${new Date().toISOString()}_${id}_${identifier}_`;
  if(display) {
    return html2canvas(document.documentElement).then((canvas) => {
      const doc = window.open('', '_blank', {
        popup: true,
        noopener: true,
        noreferrer: true,
      }).document;
      doc.body.appendChild(canvas);

      let link = document.createElement('a');
      link.download = prefix + '.png'
      canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.click();
      });
      link.remove();

      get_data(prefix +  'sync',  sync_data);
      get_data(prefix + 'async', async_data);
    },
    () => {
      get_data(prefix +  'sync',  sync_data);
      get_data(prefix + 'sync', sync_data);
    });
  }
  else return new Promise((r) => {
    get_data(prefix +  'sync',  sync_data);
    get_data(prefix + 'async', async_data);
    r();
  });
}

