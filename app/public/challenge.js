// Challenge page JavaScript
// Tracks metrics and prevents copy/paste

(function() {
  'use strict';

  const TOTAL_TIME = 60; // 60 seconds
  const TOTAL_CHALLENGES = 16;
  const startTime = Date.now();
  let timeRemaining = TOTAL_TIME;

  // Metrics tracking
  const metrics = {
    mouseMovements: 0,
    mousePath: [],
    keystrokes: 0,
    keystrokeTiming: [],
    fieldCompletionTimes: [],
    totalTime: 0,
    pasteAttempts: 0,
    copyAttempts: 0
  };

  let lastKeystrokeTime = null;
  let lastFieldStartTime = Date.now();
  let completedFields = 0;

  // Elements
  const form = document.getElementById('challengeForm');
  const timerEl = document.getElementById('timer');
  const progressBar = document.getElementById('progressBar');
  const metricsInput = document.getElementById('metricsInput');
  const inputs = document.querySelectorAll('[data-challenge] input');
  const realParts = document.querySelectorAll('[data-v]');

  // Timer
  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeRemaining = Math.max(0, TOTAL_TIME - elapsed);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (timeRemaining <= 10) {
      timerEl.classList.add('warning');
    }

    // Update progress
    const progress = (completedFields / TOTAL_CHALLENGES) * 100;
    progressBar.style.width = `${progress}%`;

    if (timeRemaining <= 0) {
      // Time's up - submit what we have
      metricsInput.value = JSON.stringify(metrics);
      form.submit();
    }
  }

  setInterval(updateTimer, 100);

  // Mouse tracking
  document.addEventListener('mousemove', function(e) {
    metrics.mouseMovements++;
    // Sample every 10th movement to avoid huge arrays
    if (metrics.mouseMovements % 10 === 0 && metrics.mousePath.length < 100) {
      metrics.mousePath.push([e.clientX, e.clientY]);
    }
  });

  // Keystroke tracking
  document.addEventListener('keydown', function(e) {
    const now = Date.now();
    metrics.keystrokes++;

    if (lastKeystrokeTime !== null) {
      const timeSinceLast = now - lastKeystrokeTime;
      if (metrics.keystrokeTiming.length < 200) {
        metrics.keystrokeTiming.push(timeSinceLast);
      }
    }
    lastKeystrokeTime = now;
  });

  // Field completion tracking
  inputs.forEach((input, index) => {
    input.addEventListener('focus', function() {
      lastFieldStartTime = Date.now();
    });

    input.addEventListener('blur', function() {
      if (this.value.length > 0) {
        const completionTime = Date.now() - lastFieldStartTime;
        metrics.fieldCompletionTimes.push(completionTime);
      }
    });

    input.addEventListener('input', function() {
      // Check if field looks complete (roughly expected length)
      if (this.value.length >= 6) {
        completedFields = Array.from(inputs).filter(i => i.value.length >= 6).length;
      }
    });
  });

  // Prevent paste
  document.addEventListener('paste', function(e) {
    e.preventDefault();
    metrics.pasteAttempts++;
    console.warn('Paste is disabled for this challenge');
  });

  // Prevent copy
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    metrics.copyAttempts++;
    console.warn('Copy is disabled for this challenge');
  });

  // Prevent cut
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    metrics.copyAttempts++;
  });

  // Prevent selecting text on real string parts
  realParts.forEach(el => {
    el.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });

    el.addEventListener('mousedown', function(e) {
      e.preventDefault();
    });
  });

  // Prevent context menu on string parts
  document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('[data-v]') || e.target.closest('[data-x]')) {
      e.preventDefault();
      metrics.copyAttempts++;
    }
  });

  // On form submit
  form.addEventListener('submit', function(e) {
    metrics.totalTime = Date.now() - startTime;
    metricsInput.value = JSON.stringify(metrics);
  });

})();
