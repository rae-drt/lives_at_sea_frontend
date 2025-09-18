import html2canvas from 'html2canvas';

function prefix(identifier, id) {
  return `LatS_${identifier}_${id}_` + new Date().toISOString();
}

function get_data(identifier, id, data) {
  if(data) {
    let link = document.createElement('a');
    link.download = prefix(identifier, id) + '.json';
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
    link.click();
    link.remove();
  }
}

export function snapshot(id, ignore, display, data, identifier) {
  if(ignore) return new Promise((resolve) => {resolve(true);});
  return html2canvas(document.documentElement).then((canvas) => {
      if(display) {
        const doc = window.open('', '_blank', {
          popup: true,
          noopener: true,
          noreferrer: true,
        }).document;
        doc.body.appendChild(canvas);
      }

      let link = document.createElement('a');
      link.download = prefix(identifier, id) + '.png'
      canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.click();
      });
      link.remove();

      get_data(identifier, id, data);
  },
  () => {
    get_data(identifier, id, data);
  });
}

