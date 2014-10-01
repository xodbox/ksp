// Generated by CoffeeScript 1.8.0
(function() {
  var HEIGHT, WIDTH;

  importScripts('numeric-1.2.6.min.js');

  importScripts('quaternion.js');

  importScripts('roots.js');

  importScripts('lambert.js');

  importScripts('orbit.js');

  importScripts('celestialbodies.js');

  WIDTH = 300;

  HEIGHT = 300;

  this.onmessage = function(event) {
    var arrivalTime, deltaV, deltaVCount, deltaVs, departureTime, destinationBody, destinationOrbit, distancia, earliestDeparture, error, finalOrbitalVelocity, i, initialOrbitalVelocity, lastProgress, logDeltaV, maxDeltaV, minDeltaV, minDeltaVPoint, n1, now, originBody, originOrbit, originPositions, originVelocities, p1, p2, referenceBody, shortestTimeOfFlight, sumLogDeltaV, sumSqLogDeltaV, timeOfFlight, transfer, transferType, trueAnomaly, v1, v2, x, xResolution, y, yResolution, _i, _j, _k;
    transferType = event.data.transferType;
    originBody = CelestialBody.fromJSON(event.data.originBody);
    initialOrbitalVelocity = event.data.initialOrbitalVelocity;
    destinationBody = CelestialBody.fromJSON(event.data.destinationBody);
    finalOrbitalVelocity = event.data.finalOrbitalVelocity;
    earliestDeparture = event.data.earliestDeparture;
    shortestTimeOfFlight = event.data.shortestTimeOfFlight;
    xResolution = event.data.xScale / WIDTH;
    yResolution = event.data.yScale / HEIGHT;
    distancia = event.data.distancia;
    originOrbit = originBody.orbit;
    destinationOrbit = destinationBody.orbit;
    referenceBody = originOrbit.referenceBody;
    n1 = originOrbit.normalVector();
    originPositions = [];
    originVelocities = [];
    for (x = _i = 0; 0 <= WIDTH ? _i < WIDTH : _i > WIDTH; x = 0 <= WIDTH ? ++_i : --_i) {
      departureTime = earliestDeparture + x * xResolution;
      trueAnomaly = originOrbit.trueAnomalyAt(departureTime);
      originPositions[x] = originOrbit.positionAtTrueAnomaly(trueAnomaly);
      originVelocities[x] = originOrbit.velocityAtTrueAnomaly(trueAnomaly);
    }
    deltaVs = new Float64Array(WIDTH * HEIGHT);
    i = 0;
    minDeltaV = Infinity;
    maxDeltaV = 0;
    sumLogDeltaV = 0;
    sumSqLogDeltaV = 0;
    deltaVCount = 0;
    lastProgress = 0;
    for (y = _j = 0; 0 <= HEIGHT ? _j < HEIGHT : _j > HEIGHT; y = 0 <= HEIGHT ? ++_j : --_j) {
      timeOfFlight = shortestTimeOfFlight + ((HEIGHT - 1) - y) * yResolution;
      for (x = _k = 0; 0 <= WIDTH ? _k < WIDTH : _k > WIDTH; x = 0 <= WIDTH ? ++_k : --_k) {
        departureTime = earliestDeparture + x * xResolution;
        arrivalTime = departureTime + timeOfFlight;
        p1 = originPositions[x];
        v1 = originVelocities[x];
        trueAnomaly = destinationOrbit.trueAnomalyAt(arrivalTime);
        p2 = destinationOrbit.positionAtTrueAnomaly(trueAnomaly);
        v2 = destinationOrbit.velocityAtTrueAnomaly(trueAnomaly);
        distancia = 20;
        transfer = Orbit.transfer(transferType, originBody, destinationBody, departureTime, timeOfFlight, initialOrbitalVelocity, finalOrbitalVelocity, p1, v1, n1, p2, v2, 100);
        deltaVs[i++] = deltaV = transfer.deltaV;
        if (deltaV < minDeltaV) {
          minDeltaV = deltaV;
          minDeltaVPoint = {
            x: x,
            y: (HEIGHT - 1) - y
          };
        }
        if (deltaV > maxDeltaV) {
          maxDeltaV = deltaV;
        }
        if (!isNaN(deltaV)) {
          logDeltaV = Math.log(deltaV);
          sumLogDeltaV += logDeltaV;
          sumSqLogDeltaV += logDeltaV * logDeltaV;
          deltaVCount++;
        }
      }
      now = Date.now();
      if (now - lastProgress > 100) {
        postMessage({
          progress: (y + 1) / HEIGHT
        });
        lastProgress = now;
      }
    }
    try {
      return postMessage({
        deltaVs: deltaVs.buffer,
        minDeltaV: minDeltaV,
        minDeltaVPoint: minDeltaVPoint,
        maxDeltaV: maxDeltaV,
        deltaVCount: deltaVCount,
        sumLogDeltaV: sumLogDeltaV,
        sumSqLogDeltaV: sumSqLogDeltaV
      }, [deltaVs.buffer]);
    } catch (_error) {
      error = _error;
      return postMessage({
        deltaVs: deltaVs,
        minDeltaV: minDeltaV,
        minDeltaVPoint: minDeltaVPoint,
        maxDeltaV: maxDeltaV,
        deltaVCount: deltaVCount,
        sumLogDeltaV: sumLogDeltaV,
        sumSqLogDeltaV: sumSqLogDeltaV
      });
    }
  };

}).call(this);
