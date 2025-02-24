;; Universal Fitness Function Contract

(define-map reality-metrics
  { reality-id: uint }
  {
    complexity: uint,
    harmony: uint,
    progress: uint
  }
)

(define-data-var next-reality-id uint u0)

(define-public (register-reality)
  (let
    ((new-id (+ (var-get next-reality-id) u1)))
    (var-set next-reality-id new-id)
    (ok (map-set reality-metrics
      { reality-id: new-id }
      {
        complexity: u0,
        harmony: u0,
        progress: u0
      }
    ))
  )
)

(define-public (update-metrics (reality-id uint) (complexity uint) (harmony uint) (progress uint))
  (ok (map-set reality-metrics
    { reality-id: reality-id }
    {
      complexity: complexity,
      harmony: harmony,
      progress: progress
    }
  ))
)

(define-read-only (get-fitness-score (reality-id uint))
  (let
    ((metrics (unwrap! (map-get? reality-metrics { reality-id: reality-id }) (err u404))))
    (ok (+ (get complexity metrics) (get harmony metrics) (get progress metrics)))
  )
)

(define-read-only (compare-realities (reality-id-1 uint) (reality-id-2 uint))
  (let
    ((score-1 (unwrap! (get-fitness-score reality-id-1) (err u404)))
     (score-2 (unwrap! (get-fitness-score reality-id-2) (err u404))))
    (ok (if (> score-1 score-2) u1 (if (< score-1 score-2) u2 u0)))
  )
)

