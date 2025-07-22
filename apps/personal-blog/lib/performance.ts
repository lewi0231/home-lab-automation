// Performance monitoring utilities

export const performance = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name)
    }
  },

  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        const measure = window.performance.measure(name, startMark, endMark)
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`)
        return measure.duration
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error)
      }
    }
  },

  measurePageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = window.performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming
        if (navigation) {
          console.log('Page Load Time:', {
            domContentLoaded:
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            total: navigation.loadEventEnd - navigation.fetchStart,
          })
        }
      })
    }
  },
}

// Web Vitals monitoring
export const webVitals = {
  trackCLS: (onCLS: (cls: number) => void) => {
    if (typeof window !== 'undefined') {
      let clsValue = 0
      const clsEntries: PerformanceEntry[] = []

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean
            value?: number
          }
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0
            clsEntries.push(entry)
          }
        }
        onCLS(clsValue)
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    }
  },

  trackFID: (onFID: (fid: number) => void) => {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const firstInputEntry = entry as PerformanceEntry & {
            processingStart?: number
            startTime?: number
          }
          if (firstInputEntry.processingStart && firstInputEntry.startTime) {
            onFID(firstInputEntry.processingStart - firstInputEntry.startTime)
          }
        }
      })

      observer.observe({ entryTypes: ['first-input'] })
    }
  },

  trackLCP: (onLCP: (lcp: number) => void) => {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const lcpEntry = entry as PerformanceEntry & { startTime?: number }
          if (lcpEntry.startTime) {
            onLCP(lcpEntry.startTime)
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  },
}
