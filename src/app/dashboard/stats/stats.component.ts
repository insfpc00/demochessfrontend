import { UserService} from './../../core/user.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { IntervalType } from 'src/app/model/userstats';
import { DatePipe } from '@angular/common';
import { timeControlTypes } from 'src/app/timecontrol/timecontrol.pipe';
import { customDatasetFillerPlugin } from './customDatasetFillerPlugin';
import { MatchesStats } from 'src/app/model/matchesstats';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [DatePipe]
})
export class StatsComponent implements OnInit {
  eloChart: Chart;
  matchHistoryChart: Chart;
  overallMatchHistoryChart: Chart;
  matchHistoryData = {};
  dates = [];
  bulletRatings = [];
  rapidRatings = [];
  blitzRatings = [];
  options = {
    last: 7,
    groupBy: IntervalType.WEEK
  };
  selectedMatchType: string = timeControlTypes.blitz;

  palette = [	'#4e14c5', '#23c6f8', '#81f0cd', '#ccffd8', '#fdffff'];

  constructor(private userService: UserService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.refreshCharts();
    this.buildEloStatsChart();
    this.buildMatchHistoryChart();
    this.buildOverallMatchHistoryChart();
  }

  private transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  refreshCharts() {

    this.userService
      .getEloStats(
        this.transformDate(new Date()),
        this.options.groupBy,
        this.options.last
      )
      .subscribe(stats => {
        this.blitzRatings = stats.blitzEloRatings.map(e => Math.round(e));
        this.bulletRatings = stats.bulletEloRatings.map(e => Math.round(e));
        this.rapidRatings = stats.rapidEloRatings.map(e => Math.round(e));
        this.dates = stats.labels;
        this.eloChart.config.data = {
          lineTension: 0,
          labels: this.dates,
          datasets: [
            {
              label: 'Bullet',
              lineTension: 0,
              data: this.bulletRatings,
              borderColor: this.palette[0],
              fill: false,
              fillBetweenColor: this.hexToRgbA(this.palette[0], 0.3)
            },
            {
              label: 'Blitz',
              lineTension: 0,
              data: this.blitzRatings,
              borderColor: this.palette[1],
              fill: false,
              fillBetweenColor: this.hexToRgbA(this.palette[1], 0.3)
            },
            {
              label: 'Rapid',
              lineTension: 0,
              data: this.rapidRatings,
              borderColor: this.palette[2],
              fill: false,
              fillBetweenColor: this.hexToRgbA(this.palette[2], 0.3)
            }
          ]
        };
        this.eloChart.update({});
      });

    this.userService
      .getMatchesStats(
        this.transformDate(new Date()),
        this.options.groupBy,
        this.options.last
      )
      .subscribe(stats => {
        this.matchHistoryData = { bullet: stats.bulletStats, blitz: stats.blitzStats, rapid: stats.rapidStats };
        this.showStats(this.selectedMatchType);
      }
      );


  }

  hexToRgbA(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
}

  private buildEloStatsChart() {
    this.eloChart = new Chart('lineChart', {
      type: 'line',
      plugins: [customDatasetFillerPlugin],
      options: {
        title: {
          text: 'ELO ratings progression',
          display: true,
          fontSize: 16
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: {

          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date'
              },
              display: true
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Elo rating'
              },
              display: true
            }
          ]
        }
      }
    });
  }

  private buildMatchHistoryChart() {
    const backGroundColors = this.palette;
    const chartLabels = [
      'Wins as white',
      'Wins as black',
      'Draws',
      'Losses'];


    const pieData = {
      labels: chartLabels,
      datasets: [
        {
          labels: chartLabels,
          data: [],
          backgroundColor: backGroundColors
        }
      ]
    };

    this.matchHistoryChart = new Chart('matchHistoryChart', { type: 'doughnut', data: pieData });

    this.matchHistoryChart.options = {
      title: {
        display: true,
        text: 'Match stats',
        fontSize: 16
      },
      tooltips: {
        enabled: true,
        mode: 'index',
        callbacks: {
            label(tooltipItems, data) {
              let sum = 0;

              data.datasets[tooltipItems.datasetIndex].data.forEach(v => sum += v);
              let percent = 0;
              if (sum !== 0) {
              percent = 100 * (data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] / sum);
            }
              return data.datasets[tooltipItems.datasetIndex]
              .labels[tooltipItems.index] + ':' +
               data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' (' + percent.toFixed(1) + '%)';
            }
        }
      },
      responsive: true,
      circumference: Math.PI,
      rotation: -Math.PI,
      legend: {
        display: true
      },
      percentageInnerCutout: 80,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
  }

  private buildOverallMatchHistoryChart() {

    const chartData = {
      labels: ['Won', 'Lost', 'Tied'],
      datasets: [
        {
          label: 'Bullet',
          data: [],
          backgroundColor: this.palette[1]
        }, {
          label: 'Blitz',
          data: [],
          backgroundColor: this.palette[2]
        },
        {
          label: 'Rapid',
          data: [],
          backgroundColor: this.palette[3]
        }
      ]
    };

    this.overallMatchHistoryChart = new Chart('overallMatchHistoryChart', { type: 'bar', data: chartData });
    this.overallMatchHistoryChart.options = {
      title: {
        display: true,
        text: 'Overall Statistics',
        fontSize: 16
      },
      tooltips: {
        enabled: true,
        mode: 'index',
        callbacks: {
            label(tooltipItems, data) {
              return data.datasets[tooltipItems.datasetIndex].label + ' ' + tooltipItems.value + '%';
            }
        }
      },
      legend: {
        display: true
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          /* ticks: {
            max: 100,
            min: 0
        }, */
          scaleLabel: {
            display: true,
            labelString: 'percent'
          },
          stacked: true
        }]
      }
    };

    this.userService
      .getMatchesStats()
      .subscribe(stats => {
        const totalMatches = stats.blitzStats.totalMatches + stats.rapidStats.totalMatches + stats.bulletStats.totalMatches;
        const toPercent = (stat: number, m: MatchesStats) => (stat * 100 / totalMatches).toPrecision(2);
        const transformStats = (m: MatchesStats) => [toPercent(m.matchesWonAsBlack + m.matchesWonAsWhite, m),
          toPercent(m.totalMatches - (m.matchesWonAsBlack +
            m.matchesWonAsWhite + m.drawMatches), m),
            toPercent(m.drawMatches, m)] ;

        chartData.datasets[0].data = transformStats(stats.bulletStats);
        chartData.datasets[1].data = transformStats(stats.blitzStats);
        chartData.datasets[2].data = transformStats(stats.rapidStats);

        this.overallMatchHistoryChart.update();
      });
  }

  showStats(type: string) {
    this.selectedMatchType = type;
    if (this.matchHistoryData[type] !== null) {
    this.matchHistoryChart.data.datasets[0].data =
      [this.matchHistoryData[type].matchesWonAsWhite,
      this.matchHistoryData[type].matchesWonAsBlack,
      this.matchHistoryData[type].drawMatches,
      this.matchHistoryData[type].totalMatches - this.matchHistoryData[type].matchesWonAsBlack
      - this.matchHistoryData[type].matchesWonAsWhite];
    }
    this.matchHistoryChart.options.title.text = type.toUpperCase() + ' statistics ( last ' +
      this.options.last + ' ' + this.options.groupBy.toLowerCase() + 's )';
    this.matchHistoryChart.update();

  }

}
