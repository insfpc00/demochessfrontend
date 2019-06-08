export const fillerBreakPoints = {
  bulletBreakPoint: 0,
  blitzBreakPoint: 0,
  rapidBreakPoint: 0
};

const bulletImg = new Image();
bulletImg.src = '../../../assets/images/lightning.svg';

const blitzImg = new Image();
blitzImg.src = '../../../assets/images/flame.svg';

const rapidImg = new Image();
rapidImg.src = '../../../assets/images/rabbit.svg';

export const customFillerPlugin = {



  beforeDraw(chart) {
    const ctx = chart.chart.ctx;
    ctx.save();

    const divisions = chart.options.scales.xAxes[1].labels.length - 1;
    if (divisions > 0) {
      const inc = (chart.chartArea.right - chart.chartArea.left) / divisions;
      const ysize = chart.chartArea.bottom - chart.chartArea.top;

      const prevGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = 0.07;
      if (fillerBreakPoints.bulletBreakPoint !== -1) {
        let end = 0;

        if (fillerBreakPoints.blitzBreakPoint !== -1) {
          end = fillerBreakPoints.blitzBreakPoint;
        } else if (fillerBreakPoints.rapidBreakPoint !== -1) {
          end = fillerBreakPoints.rapidBreakPoint;
        } else {
          end = divisions;
        }
        ctx.drawImage(bulletImg, chart.chartArea.left + 0.2 * inc * end, chart.chartArea.top + 0.2 * ysize, 0.6 * inc * end, 0.6 * ysize);
      }

      if (fillerBreakPoints.blitzBreakPoint !== -1 && fillerBreakPoints.blitzBreakPoint < divisions) {

        let end = 0;

        if (fillerBreakPoints.rapidBreakPoint !== -1) {
          end = fillerBreakPoints.rapidBreakPoint;
        } else {
          end = divisions;
        }
        const divs= end - fillerBreakPoints.blitzBreakPoint;
        ctx.drawImage(blitzImg, chart.chartArea.left +
          inc * fillerBreakPoints.blitzBreakPoint + 0.2 * inc * divs, chart.chartArea.top + 0.2 * ysize, 0.6 * inc * divs, 0.6 * ysize);
      }

      if (fillerBreakPoints.rapidBreakPoint !== -1 && fillerBreakPoints.rapidBreakPoint < divisions) {
        const divs = divisions - fillerBreakPoints.rapidBreakPoint ;
        ctx.drawImage(rapidImg, chart.chartArea.left +
          inc * fillerBreakPoints.rapidBreakPoint + 0.2 * inc * divs, chart.chartArea.top + 0.2 * ysize, 0.6 * inc * divs, 0.6 * ysize);

      }

      ctx.globalAlpha = prevGlobalAlpha;

    }
  }

};
