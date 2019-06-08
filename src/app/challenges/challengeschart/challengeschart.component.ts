import { UserService } from './../../core/user.service';

import { Component, OnInit, Input, IterableDiffers, IterableDiffer, DoCheck, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Chart } from 'chart.js';
import { Challenge } from 'src/app/model/challenge.model';
import { stringToColor } from 'src/app/utils/utils';
import { customFillerPlugin, fillerBreakPoints } from './customFillerPlugin';
import { TimeControlPipe, TimeControlTypePipe, timeControlTypes } from 'src/app/timecontrol/timecontrol.pipe';

@Component({
  selector: 'app-challengeschart',
  templateUrl: './challengeschart.component.html',
  styleUrls: ['./challengeschart.component.css'],
  providers: [TimeControlPipe, TimeControlTypePipe]
})
export class ChallengeschartComponent implements OnInit, DoCheck {

  @Input() set challenges(challenges: Challenge[]) {
    this._challenges = challenges;
    this.updateChart();
  }
  constructor(private timeControlPipe: TimeControlPipe, private _iterableDiffers: IterableDiffers,
    private userService: UserService, private timeControlTypePipe: TimeControlTypePipe) {
    this._iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  private _iterableDiffer: IterableDiffer<{}>;
  private _challenges: Challenge[];
  @Output()
  challengeClickedEvent = new EventEmitter<number>();

  @Input() username: string;

  private challengesChart: Chart;

  ngDoCheck() {
    let changes = this._iterableDiffer.diff(this._challenges);
    if (changes) {
      this.updateChart();
    }
  }


  ngOnInit() {
    this.buildChallengesChart();
  }

  private buildChallengesChart() {

    const onChartClick = evt => {
      const elements = this.challengesChart.getElementsAtEvent(evt).filter(e => e.inYRange(evt.offsetY));
      if (elements.length === 1) {
        const data = this.challengesChart.data.datasets[elements[0]._datasetIndex].data[elements[0]._index]
        this.challengeClickedEvent.emit(data.id);
      }
    };

    const onChartHover = evt => {
      evt.target.style.cursor = 'default';
      const elements = this.challengesChart.getElementsAtEvent(evt).filter(e => e.inYRange(evt.offsetY));
      if (elements.length === 1) {
        const data = this.challengesChart.data.datasets[elements[0]._datasetIndex].data[elements[0]._index]
        if (data.username !== this.username) {
          evt.target.style.cursor = 'pointer';
        } else {
          evt.target.style.cursor = 'default';
        }

      }
    };


    const colorize = (opaque, context) => {
      return context.dataset.data[context.dataIndex].colorize;
    }

    this.challengesChart = new Chart('scatterChart', {
      type: 'bubble',
      plugins: [customFillerPlugin],
      data: {
        datasets: [{
          type: 'bubble',
          label: 'Mine',
          backgroundColor: 'rgba(35, 198, 248,1)',
          borderWidth: 1,
          data: [
          ]
        },
        {
          type: 'bubble',
          label: 'From users',
          borderWidth: 1,
          data: [
          ],
        },
        {
          borderColor: 'rgba(35, 198, 248,0.9)',
          borderWidth: 2,
          backgroundColor: 'rgba(35, 198, 248,0.5)',
          lineTension: 0,
          fill: true,
          label: 'My bullet elo',
          data: [],
          type: 'line'
        },
        {
          borderColor: 'rgba(129, 240, 205,0.9)',
          borderWidth: 2,
          backgroundColor: 'rgba(129, 240, 205,0.5)',
          lineTension: 0,
          fill: true,
          label: 'My blitz elo',
          data: [],
          type: 'line'
        },
        {
          borderColor: 'rgba(204, 255, 216,0.9)',
          borderWidth: 2,
          backgroundColor: 'rgba(204, 255, 216,0.5)',
          lineTension: 0,
          fill: true,
          label: 'My rapid elo',
          data: [],
          type: 'line'
        }
        ]
      },
      options: {
        onClick: onChartClick,
        onHover: onChartHover,
        legend: {
          display: true,
          onClick: null,
          labels: {
            generateLabels: this.generateLabels
          }

        },
        elements: {
          point: {
            backgroundColor: colorize.bind(null, false),
            borderColor: colorize.bind(null, true),
            borderWidth: function (context) {
              return Math.min(Math.max(1, context.datasetIndex + 1), 8);
            },
            hoverBackgroundColor: 'transparent',
            /* hoverBorderColor: function(context) {
              return utils.color(context.datasetIndex);
            }, */
            hoverBorderWidth: function (context) {
              var value = context.dataset.data[context.dataIndex];
              return Math.round(8 * value.v / 1000);
            },
            radius: function (context) {
              var value = context.dataset.data[context.dataIndex];
              var size = context.chart.width;
              var base = Math.abs(value.v) / 1000;
              return (size / 24) * base;
            }
          }
        },
        title: {
          display: true,
          text: 'Available challenges',
          fontSize: 16
        },

        tooltips: {
          enabled: true,
          mode: 'point',
          callbacks: {
            label(tooltipItems, data) {
              const tooltipData = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
              return tooltipData.username + '(' + tooltipData.y + ')' + ' as ' + tooltipData.color;
            }
          }
        },
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              display: false,

            },
            {
              gridLines: {
                color: 'rgba(0,0,0,0.2)',
                lineWidth: 1
              },
              type: 'category',
              labels: [],
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'duration'
              }
            }],
          yAxes: [{
            gridLines: {
              color: 'rgba(0,0,0,0.2)',
              lineWidth: 1
            },
            type: 'linear',
            ticks: {
              suggestedMin: 1000,
              suggestedMax: 3000,
              stepSize: 150
            },
            scaleLabel: {
              display: true,
              labelString: 'elo rating'
            }
          }]
        }
      }
    });
  }

  private updateChart() {

    if (this.challengesChart && this._challenges) {

      const distinctTimeControls = {};

      //.sort((a, b) => a.timeInSeconds - b.timeInSeconds + a.timeIncrementInSeconds - b.timeIncrementInSeconds));

      this._challenges.forEach((c, idx) => {
        const mtime = c.timeInSeconds + c.timeIncrementInSeconds;
        if (!distinctTimeControls[mtime]) { distinctTimeControls[mtime] = idx; }
      });
      const orderedChallenges = [];

      for (const k of Object.keys(distinctTimeControls)) {
        orderedChallenges.push(this._challenges[distinctTimeControls[k]]);
      }

      orderedChallenges.sort((a, b) => a.timeInSeconds - b.timeInSeconds + a.timeIncrementInSeconds - b.timeIncrementInSeconds);
      const allX = orderedChallenges.
        map(c => this.timeControlPipe.transform(c));

      this.challengesChart.options.scales.xAxes[1].labels = allX;
      const mapFunc = (c: Challenge) => ({
        x: this.challengesChart.options.scales.xAxes[1].labels
          .indexOf(this.timeControlPipe.transform(c)),
        y: Math.round(c.eloRating),
        r: c.userName === this.username ? 5 : 10,
        username: c.userName,
        color: c.color,
        colorize: '#' + stringToColor(c.userName),
        id: c.challengeId
      });

      this.challengesChart.data.datasets[0].data =
        this._challenges.filter(c => c.userName === this.username)
          .map(mapFunc);

      this.challengesChart.data.datasets[1].data =
        this._challenges.filter(c => c.userName !== this.username)
          .map(mapFunc);

      const bulletStart = orderedChallenges.indexOf(orderedChallenges.
        find(c => this.timeControlTypePipe.transform(c) === timeControlTypes.bullet));
      const blitzStart = orderedChallenges.indexOf(orderedChallenges.
        find(c => this.timeControlTypePipe.transform(c) === timeControlTypes.blitz));
      const rapidStart = orderedChallenges.indexOf(orderedChallenges.
        find(c => this.timeControlTypePipe.transform(c) === timeControlTypes.rapid));

      const bulletEnd = blitzStart < 0 ? (rapidStart < 0 ? orderedChallenges.length - 1 : rapidStart) : blitzStart;
      const blitzEnd = rapidStart < 0 ? orderedChallenges.length - 1 : rapidStart;

      if (bulletStart !== -1) {
        this.challengesChart.data.datasets[2].data = [
          { x: 0, y: this.userService.loggedUserProfile.eloRatings[0] },
          { x: bulletEnd, y: this.userService.loggedUserProfile.eloRatings[0] }];
      } else {
        this.challengesChart.data.datasets[2].data = [];
      }

      if (blitzStart !== -1) {
        this.challengesChart.data.datasets[3].data = [
          { x: blitzStart, y: this.userService.loggedUserProfile.eloRatings[1] },
          { x: blitzEnd, y: this.userService.loggedUserProfile.eloRatings[1] }];
      } else {
        this.challengesChart.data.datasets[3].data = [];
      }

      if (rapidStart !== -1) {
        this.challengesChart.data.datasets[4].data = [
          { x: rapidStart, y: this.userService.loggedUserProfile.eloRatings[0] },
          { x: orderedChallenges.length - 1, y: this.userService.loggedUserProfile.eloRatings[0] }];
      } else {
        this.challengesChart.data.datasets[4].data = [];
      }
      this.challengesChart.update();
      fillerBreakPoints.bulletBreakPoint = bulletStart;
      fillerBreakPoints.blitzBreakPoint = blitzStart;
      fillerBreakPoints.rapidBreakPoint = rapidStart;

    }
  }
  private generateLabels(chart: Chart) {

    return chart.data.datasets.filter((ds, idx) => idx > 1)
    .map(ds => { return { text: ds.label, hidden: false, fillStyle: ds.borderColor }; });


  }

}
