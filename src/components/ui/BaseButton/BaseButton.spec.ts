import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseButton, {
      props,
      slots: {
        default: 'Click me'
      }
    })
  }

  const expectClasses = (wrapper: VueWrapper, classes: string[]) => {
    const buttonClasses = wrapper.find('button').classes()

    classes.forEach((className) => {
      expect(buttonClasses).toContain(className)
    })
  }

  describe('rendering', () => {
    it('renders the button', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('renders the slot content', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toBe('Click me')
    })

    it('uses button as the default type', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('button').attributes('type')).toBe('button')
    })

    it('allows the button type to be changed', () => {
      const wrapper = mountComponent({
        type: 'submit'
      })

      expect(wrapper.find('button').attributes('type')).toBe('submit')
    })
  })

  describe('variants', () => {
    it('applies primary variant classes by default', () => {
      const wrapper = mountComponent()

      expectClasses(wrapper, ['bg-black', 'text-white', 'hover:bg-gray-800', 'focus:ring-black'])
    })

    it('applies secondary variant classes', () => {
      const wrapper = mountComponent({
        variant: 'secondary'
      })

      expectClasses(wrapper, [
        'border',
        'border-gray-300',
        'bg-white',
        'text-gray-900',
        'hover:bg-gray-100',
        'focus:ring-gray-400'
      ])
    })

    it('applies danger variant classes', () => {
      const wrapper = mountComponent({
        variant: 'danger'
      })

      expectClasses(wrapper, ['bg-red-600', 'text-white', 'hover:bg-red-700', 'focus:ring-red-500'])
    })

    it('applies ghost variant classes', () => {
      const wrapper = mountComponent({
        variant: 'ghost'
      })

      expectClasses(wrapper, [
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100',
        'focus:ring-gray-400'
      ])
    })
  })

  describe('sizes', () => {
    it('applies small size classes', () => {
      const wrapper = mountComponent({
        size: 'sm'
      })

      expectClasses(wrapper, ['px-3', 'py-1.5', 'text-sm'])
    })

    it('applies medium size classes by default', () => {
      const wrapper = mountComponent()

      expectClasses(wrapper, ['px-4', 'py-2', 'text-sm'])
    })

    it('applies large size classes', () => {
      const wrapper = mountComponent({
        size: 'lg'
      })

      expectClasses(wrapper, ['px-5', 'py-2.5', 'text-base'])
    })
  })

  describe('styles', () => {
    it('uses the default styles', () => {
      const button = mountComponent().find('button')

      expect(button.attributes('style')).toContain('background-color: rgb(0, 0, 0)')

      expect(button.attributes('style')).toContain('font-family: Roboto')

      expect(button.attributes('style')).toContain('font-weight: 400')
    })

    it('applies custom styles', () => {
      const button = mountComponent({
        color: '#ff0000',
        font: 'Arial',
        fontWeight: '700'
      }).find('button')

      expect(button.attributes('style')).toContain('background-color: rgb(255, 0, 0)')

      expect(button.attributes('style')).toContain('font-family: Arial')

      expect(button.attributes('style')).toContain('font-weight: 700')
    })
  })

  describe('disabled state', () => {
    it('is enabled by default', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('button').element.disabled).toBe(false)
    })

    it('disables the button when disabled is true', () => {
      const wrapper = mountComponent({
        disabled: true
      })

      expect(wrapper.find('button').element.disabled).toBe(true)
    })

    it('applies disabled classes', () => {
      const wrapper = mountComponent({
        disabled: true
      })

      expectClasses(wrapper, ['disabled:cursor-not-allowed', 'disabled:opacity-50'])
    })
  })

  describe('loading state', () => {
    it('disables the button while loading', () => {
      const wrapper = mountComponent({
        loading: true
      })

      expect(wrapper.find('button').element.disabled).toBe(true)
    })

    it('renders the loading spinner', () => {
      const wrapper = mountComponent({
        loading: true
      })

      const spinner = wrapper.find('span[aria-hidden="true"]')

      expect(spinner.exists()).toBe(true)
    })

    it('does not render slot content while loading', () => {
      const wrapper = mountComponent({
        loading: true
      })

      expect(wrapper.text()).not.toContain('Click me')
    })

    it('renders slot content when not loading', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('Click me')

      expect(wrapper.find('span[aria-hidden="true"]').exists()).toBe(false)
    })
  })

  describe('click event', () => {
    it('emits click when clicked', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('emits the original MouseEvent', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')

      const emittedEvents = wrapper.emitted('click')

      expect(emittedEvents).toHaveLength(1)
      expect(emittedEvents?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mountComponent({
        disabled: true
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mountComponent({
        loading: true
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('common classes', () => {
    it('always applies the base button classes', () => {
      const wrapper = mountComponent()

      expectClasses(wrapper, [
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-sm',
        'transition-colors',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'cursor-pointer'
      ])
    })
  })
})
