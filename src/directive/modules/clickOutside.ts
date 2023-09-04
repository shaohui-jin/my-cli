import type { App } from 'vue'
const captureInstances = Object.create(null)
const nonCaptureInstances = Object.create(null)
const instancesList = [captureInstances, nonCaptureInstances]

const commonHandler = function _onCommonEvent(context, instances: any, event: Event) {
  const { target } = event
  const itemIteratee = function _itemIteratee(item) {
    const { el } = item
    if (el !== target && !el.contains(target)) {
      const { binding } = item
      if (binding.modifiers.stop) {
        event.stopPropagation()
      }
      if (binding.modifiers.prevent) {
        event.preventDefault()
      }
      binding.value.call(context, event)
    }
  }

  const keysIteratee = function _keysIteratee(eventName) {
    return instances[eventName].forEach(itemIteratee)
  }
  Object.keys(instances).forEach(keysIteratee)
}

const captureEventHandler = function onCaptureEvent(event) {
  commonHandler(this, captureInstances, event)
}

const nonCaptureEventHandler = function onNonCaptureEvent(event) {
  commonHandler(this, nonCaptureInstances, event)
}

const getEventHandler = function _getEventHandler(useCapture) {
  return useCapture ? captureEventHandler : nonCaptureEventHandler
}

export function clickOutside(app: App) {
  app.directive('click-outside', {
    mounted(el, binding) {
      if (typeof binding.value !== 'function') {
        throw new TypeError('Binding value must be a function.')
      }

      let eventType
      const { modifiers } = binding
      if (modifiers.click) eventType = 'click'
      else if (modifiers.mousedown) eventType = 'mousedown'
      else if (modifiers.touchstart) eventType = 'touchstart'
      else eventType = 'click'
      const useCapture = binding.arg
      const normalisedBinding = {
        ...binding,
        ...{
          modifiers: {
            ...{
              capture: false,
              prevent: false,
              stop: false
            },
            ...binding.modifiers
          }
        }
      }
      const instances = useCapture ? captureInstances : nonCaptureInstances
      if (!Array.isArray(instances[eventType])) {
        instances[eventType] = []
      }
      if (instances[eventType].push({ el, binding: normalisedBinding }) === 1) {
        if (typeof document === 'object' && document) {
          document.addEventListener(eventType, getEventHandler(useCapture), useCapture)
        }
      }
    },
    unmounted(el) {
      const compareElements = function _compareElements(item) {
        return item.el !== el
      }
      const instancesIteratee = function _instancesIteratee(instances) {
        const instanceKeys = Object.keys(instances)
        if (instanceKeys.length) {
          const useCapture = instances === captureInstances
          const keysIteratee = function _keysIteratee(eventName) {
            const newInstance = instances[eventName].filter(compareElements)
            if (newInstance.length) {
              instances[eventName] = newInstance
            } else {
              if (typeof document === 'object' && document) {
                document.removeEventListener(eventName, getEventHandler(useCapture), useCapture)
              }
              delete instances[eventName]
            }
          }
          instanceKeys.forEach(keysIteratee)
        }
      }
      instancesList.forEach(instancesIteratee)
    }
  })
}
