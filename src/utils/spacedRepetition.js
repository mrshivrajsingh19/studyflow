// SM-2 Algorithm implementation
// https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm

export const calculateNextReview = (quality, prevInterval, prevEasiness) => {
  // quality: 0 (total blackout) to 5 (perfect response)
  // prevInterval: days since last review
  // prevEasiness: easiness factor (default 2.5)

  let interval;
  let easiness = prevEasiness;

  // Update easiness factor
  easiness = prevEasiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  if (quality < 3) {
    // If quality is < 3 (failed to recall), reset interval
    interval = 1;
  } else {
    // Calculate new interval
    if (prevInterval === 0) {
      interval = 1;
    } else if (prevInterval === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * easiness);
    }
  }

  return { interval, easiness };
};
