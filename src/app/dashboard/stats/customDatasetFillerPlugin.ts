export const customDatasetFillerPlugin = {

  slope(x0, y0, x1, y1) { return ((y1 - y0) / (x1 - x0)); },
  calcYVal(line, xval) {
    const value =
      (line.points[1].y - line.points[0].y) /
      (line.points[1].x - line.points[0].x) * (xval - line.points[0].x) + line.points[0].y;
    return value;
  },

  intersection(x0, y0, x1, y1, x2, y2, x3, y3) {

    if (Math.round(x0) >= Math.round(x3) || Math.round(x1) === Math.round(x0)
      || Math.round(x2) === Math.round(x3) || Math.round(x1) === Math.round(x2)
      || Math.round(x3) === Math.round(x0)) {
      return null;
    }

    const m1 = this.slope(x0, y0, x1, y1);
    const m2 = this.slope(x2, y2, x3, y3);
    const b1 = m1 * -x0 + y0;
    const b2 = m2 * -x2 + y2;

    if (m2 === m1) {
      return null;
    }

    const intersectx = (b2 - b1) / (m1 - m2);
    const intersecty = m1 * intersectx + b1;
    if (intersectx <= x0 || intersectx >= x1) {
      return null;
    }
    return { x: intersectx, y: intersecty };
  },


  beforeDatasetsDraw(chart) {
    const lines = [[]];
    const ctx = chart.chart.ctx;
    const xaxis = chart.scales['x-axis-0'];
    const yaxis = chart.scales['y-axis-0'];
    const datasets = chart.data.datasets;
    ctx.save();

    for (let d = 0; d < datasets.length; d++) {
      const dataset = datasets[d];
      if (dataset.fillBetweenColor === undefined) {
        continue;
      }

      const meta1 = chart.getDatasetMeta(d);
      if (meta1.hidden) { continue; }

      for (let p = 0; p < meta1.data.length - 1; p++) {
        if (dataset.data[p] == null || dataset.data[p + 1] == null) { continue; }
        const curr = meta1.data[p];
        const next = meta1.data[p + 1];
        const p1 = { x: curr._view.x, y: curr._view.y };
        const p2 = { x: next._view.x, y: next._view.y };

        if (!lines[p]) {
          lines[p] = [];
        }
        lines[p].push({ dataset: d, points: [p1, p2] });

      }
    }



    const intersected = true;
    for (let p = 0; p < lines.length; p++) {
      const intersections = [];
      for (const linea of lines[p]) {
        for (const lineb of lines[p]) {
          if (linea !== lineb) {

            const intersect = this.intersection(linea.points[0].x,
              linea.points[0].y,
              linea.points[1].x,
              linea.points[1].y,
              lineb.points[0].x,
              lineb.points[0].y,
              lineb.points[1].x,
              lineb.points[1].y);
            if (intersect !== null) {
              intersections.push(Math.round(intersect.x));
            }

          }
        }
      }


      const allx = lines[p].map(l => l.points[0].x).concat(lines[p].map(l => l.points[1].x)).concat(intersections);

      let uniqueX = Array.from(new Set(allx));

      uniqueX = uniqueX.sort((a, b) => a - b);
      const avgValueSortedDatasets = (datasets.map(d => ({
        ds: datasets.indexOf(d), val: d.data.length === 0 ? 0 :
          d.data.reduce((d1, d2) => d1 + d2)
      }))
        .sort((d1, d2) => d2.val - d1.val)).map(d => d.ds);
      const sortedLines = Object.assign([], lines[p]
        .sort((l1, l2) => avgValueSortedDatasets.indexOf(l1.dataset) - avgValueSortedDatasets.indexOf(l2.dataset)));
      for (let i = 0; i < uniqueX.length - 1; i++) {
        const currentX = uniqueX[i];
        const nextX = uniqueX[i + 1];
        let linesToDrawInBetween = Object.assign([], sortedLines);
        let filtered = true;
        while (filtered) {
          filtered = false;
          for (let j = 0; j < linesToDrawInBetween.length - 1; j++) {
            if (this.calcYVal(linesToDrawInBetween[j], currentX) + this.calcYVal(linesToDrawInBetween[j], nextX) >
              this.calcYVal(linesToDrawInBetween[j + 1], currentX) + this.calcYVal(linesToDrawInBetween[j + 1], nextX)) {
              linesToDrawInBetween.splice(j, 1);
              filtered = true;
            }

          }
        }


        if (linesToDrawInBetween.length >= 1) {

          const lastLine = linesToDrawInBetween[linesToDrawInBetween.length - 1];
          for (let j = 0; j < linesToDrawInBetween.length - 1; j++) {
            ctx.beginPath();
            ctx.moveTo(currentX, this.calcYVal(linesToDrawInBetween[j], currentX));
            ctx.lineTo(currentX, this.calcYVal(linesToDrawInBetween[j], currentX));
            ctx.lineTo(nextX, this.calcYVal(linesToDrawInBetween[j], nextX));
            ctx.lineTo(nextX, this.calcYVal(linesToDrawInBetween[j + 1], nextX));
            ctx.lineTo(currentX, this.calcYVal(linesToDrawInBetween[j + 1], currentX));
            ctx.closePath();
            ctx.fillStyle = chart.data.datasets[linesToDrawInBetween[j].dataset].fillBetweenColor || 'rgba(0,0,0,0.1)';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.moveTo(currentX, this.calcYVal(lastLine, currentX));
          ctx.lineTo(currentX, this.calcYVal(lastLine, currentX));
          ctx.lineTo(nextX, this.calcYVal(lastLine, nextX));
          ctx.lineTo(nextX, chart.chartArea.bottom);
          ctx.lineTo(currentX, chart.chartArea.bottom);
          ctx.closePath();
          ctx.fillStyle = chart.data.datasets[lastLine.dataset].fillBetweenColor || 'rgba(0,0,0,0.1)';
          ctx.fill();
        }
      }
    }

  }
};
