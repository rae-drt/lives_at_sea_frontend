import html2canvas from 'html2canvas';

export function snapshot(id, ignore, data, identifier) {
  if(ignore) return new Promise((resolve) => {resolve(true);});
  return html2canvas(document.getElementById(id)).then((canvas) => {
      const doc = window.open('', '_blank', {
        popup: true,
        noopener: true,
        noreferrer: true,
      }).document;
      doc.body.appendChild(canvas);

      const prefix = `LatS_${identifier}_${id}_` + new Date().toISOString();

      let link = document.createElement('a');
      link.download = prefix + '.png'
      canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.click();
      });
      link.remove();

      if(data) {
        let link = document.createElement('a');
        link.download = prefix + '.json';
        link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
        link.click();
        link.remove();
      }
  });
}

