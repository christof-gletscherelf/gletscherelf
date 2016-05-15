window.onload = function() {
    // create a heatmap instance
    var heatmap = h337.create({
      container: document.getElementById('heatmapContainer'),
      maxOpacity: 0.5,
      radius: 20,
      blur: 1.0,
    });
    var heatmapContainer = document.getElementById('heatmapContainerWrapper');

    var dragSlider = document.getElementById('drag');

    var img = document.getElementById('footballfield');
    var fieldWidth = img.clientWidth;
    var fieldHeight = img.clientHeight;

    noUiSlider.create(dragSlider, {
      start: [0, 15],
      behaviour: 'drag',
      connect: true,
      range: {
        'min': 0,
        'max': 90
      },
      format: wNumb({
        decimals: 0,
      }),
      pips: {
        mode: 'values',
        values: [0,15,30,45,60,75,90]
      }
    });

    var fromMinute = document.getElementById('fromMinute');
    var toMinute = document.getElementById('toMinute');

    var wholeGameCoordinates = [];
    wholeGameCoordinates = generateWholeGameData(5400);

    function deviateCoordinateFromLen(len, max) {
      var random = Math.random();
      var linearPart = (5400 - len);
      var randomPart = max * random;
      var quota = len / max;
      var normalizedLinearPart = linearPart / quota / 2;
      var normalizedRandomPart = randomPart / quota / 2;
      var result = (normalizedLinearPart * 0.8) + (normalizedRandomPart * 0.2);
      return result >> 0;
    }

    function generateWholeGameData(len) {
      var max = 1;
      var min = 1;
      var maxX = fieldWidth;
      var maxY = fieldHeight;
      var data = [];
      while (len--) {
        data.push({
          x: deviateCoordinateFromLen(len, maxX),
          y: deviateCoordinateFromLen(len, maxY),
          value: 1
        });
      }
      return {
        max: max,
        min: min,
        data: data
      };
    }

    function getPartialGameCoordinates(from, to) {
      var partialGameCoordinates = {};
      partialGameCoordinates.max = wholeGameCoordinates.max;
      partialGameCoordinates.min = wholeGameCoordinates.min;
      partialGameCoordinates.data = wholeGameCoordinates.data.slice(from * 60, to * 60);
      return partialGameCoordinates;
    }

    dragSlider.noUiSlider.on('update', function(values, handle) {
      fromMinute.value = values[0];
      toMinute.value = values[1];
      heatmap.setData(getPartialGameCoordinates(fromMinute.value, toMinute.value));
      heatmap.repaint();
    });
  };
